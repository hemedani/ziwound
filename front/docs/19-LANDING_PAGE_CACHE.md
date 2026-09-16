# 19 — Landing page performance and caching

## The problem

`/{locale}` (e.g. `https://ziwound.com/fa`) took roughly **36 seconds** to render.

The visible symptom was the "our global impact" strip, so it was worth checking
first whether those numbers were expensive. They are not — `14,280,570` is
computed in the frontend:

```ts
const rteFieldsCount = (countryCount * 12 * 9) + (provinceCount * 10 * 9) + (cityCount * 10 * 9);
```

The cost was one backend call. Measured against production
(`185.239.0.14:1406`, with `time_connect` at 0.5 ms, so the network is not the
bottleneck):

| call | time |
|---|---|
| `user.dashboardStatistic` (7 counters) | **35.9 s** |
| — of which `count cities` | **30.5 s** |
| — everything else combined | 0.45 s |
| `heroSlide.gets` | 0.15 s |
| `report.gets` | 0.15 s |

`dashboardStatistic` called `model.countDocument({})`, which compiles to MongoDB
`countDocuments`. Even with an empty filter that runs a **full aggregation scan**,
so counting 153k cities dominated the page.

## What changed

### 1. Counts are O(1)

`back/src/user/dashboardStatistic/dashboardStatistic.fn.ts` now reads collection
metadata via `estimatedDocumentCount()` instead of scanning. The twelve models are
listed as `[resultKey, collectionName]` pairs.

Benchmarked on the local `lesan-test-req.city` collection (147,400 documents):

| method | cold | warm |
|---|---|---|
| `countDocuments({})` | 611 ms | 84 ms |
| `estimatedDocumentCount()` | **3 ms** | 3 ms |

Production's disk is far slower — the same count took 30.5 s there. The two methods
agree because none of these counts is filtered.

`report.statistics` was also being called by the landing page, and **its result was
never used** — only `locationCount` and `docCount` were derived, and neither reached
the JSX. It is gone, which removes a large `$facet` aggregation from every page view.

### 2. One cached request for the whole page

New act **`heroSlide.landingPage`** (`back/src/landingPage/`) returns everything the
page renders, for one locale, in a single response:

```
{ locale, generatedAt, dashboard, heroSlides, reports, blogPosts, countries }
```

It is registered on the `heroSlide` schema because Lesan attaches every act to a
schema, and hero slides are the only landing-exclusive content.

Rather than re-querying the database, it **reuses the existing read functions**
(`reportGets`, `blogPostGets`, `heroSlideGets`, `countryGets`, `dashboardStatisticFn`)
by calling them with a synthesized `{ details: { set, get } }` body. The payload
therefore cannot drift from what the rest of the API returns.

The frontend calls it once from `front/src/app/actions/heroSlide/landingPage.ts`,
replacing six parallel requests in `front/src/app/[locale]/page.tsx`.

### 3. The cache

`back/utils/cache.ts` — two tiers:

- **L1**: an in-process `Map`, 256 entries, always available.
- **L2**: Redis via `REDIS_URL`, shared between processes and surviving a restart.

**Redis is optional.** When `REDIS_URL` is unset, or Redis cannot be reached, every
operation falls back to L1 and a 30-second circuit breaker stops us from paying a
connection attempt on every request. A missing or restarting Redis can slow the
first request but can never break the page. This is verified by tests (see below).

### 4. Invalidation

Keys embed a namespace version — `landing:v3:fa` — so a single counter bump orphans
every locale at once, and the TTL (300 s) reclaims the abandoned entries.

Invalidation is applied by **intercepting act registration** in `back/mod.ts`:

```ts
const registerAct = coreApp.acts.setAct;
coreApp.acts.setAct = (actInp) => registerAct(withLandingInvalidation(actInp));
```

There are ~27 acts that can change the landing page, and a new mutation act would
otherwise silently leave a stale page behind. All 110 setups register through this
one object, so patching it covers every act — including ones added later. At boot
**41 acts** are wrapped; read acts are returned untouched.

The act list lives in `LANDING_AFFECTING_ACTS` in `back/utils/landingCache.ts`.
Failed mutations do **not** invalidate.

A boot-time check warns about any listed act that is not registered, because act
names do not always match their folder — `registerUser` lives in
`src/user/register/`. To get the authoritative list for a model:

```sh
curl -s -X POST "$API_URL/lesan" -H 'Content-Type: application/json' \
  -d '{"service":"main","model":"user","act":"__bogus__","details":{"set":{},"get":{}}}'
```

## Deploying

```sh
git pull
docker compose up --build -d
```

`docker-compose.yml` and `docker-compose.dev.yml` gained a `redis` service:

```yaml
redis:
  image: redis:7-alpine
  command: [redis-server, --save, "", --appendonly, "no",
            --maxmemory, 128mb, --maxmemory-policy, allkeys-lru]
```

It is a pure cache: no persistence, and it evicts rather than running out of memory.
To run without Redis, remove the service and unset `REDIS_URL` — nothing else changes.

This deploy also carries the **previously committed but undeployed** work from the
world-import session: the `city.count` fast path and `createCityIndexes()`
(`name_1`, `province_id_1_name_1`, `country_id_1_name_1`), which fix the public
explore "cities" tab that was timing out at 60 s.

## Verifying after deploy

```sh
API_URL=http://185.239.0.14:1406

# 1. the act answers, and answers fast
curl -s -X POST "$API_URL/lesan" -H 'Content-Type: application/json' \
  -d '{"service":"main","model":"heroSlide","act":"landingPage","details":{"set":{"locale":"fa"},"get":{}}}'

# 2. the counters are no longer a scan
curl -s -X POST "$API_URL/lesan" -H 'Content-Type: application/json' \
  -d '{"service":"main","model":"user","act":"dashboardStatistic","details":{"set":{},"get":{"cities":1}}}'
```

In the response, `generatedAt` tells you when the cached entry was built. Change
something on the landing page (add a hero slide, approve a report) and the next
request should return a **new** `generatedAt` and a new `landing:v<n>:<locale>` key
in Redis.

## Adding a new landing-affecting act

Add it to `LANDING_AFFECTING_ACTS` in `back/utils/landingCache.ts`. Nothing else is
needed — the interception picks it up automatically. Watch the boot log: if the act
name is wrong you get a warning naming it.

## Tests

Run from the repository root:

```sh
REDIS_URL=redis://127.0.0.1:6379 deno run --allow-all --config back/deno.json ignore-scripts/_cache_smoke.ts
REDIS_URL=redis://127.0.0.1:6379 deno run --allow-all --config back/deno.json ignore-scripts/_landing_invalidation_smoke.ts
sh /tmp/bump_regression.sh   # see ignore-scripts/_cache_bump_regression.ts
```

`_cache_bump_regression.ts` guards a bug found only by testing a **real** act: the
bump originally derived the next version from the process-local counter, so on a
fresh process (or after a restart) it could write a value that did not advance the
shared version — leaving a stale payload live, or moving the version backwards and
resurrecting old entries. `bumpNamespace` now uses atomic Redis `INCR`. The test
seeds Redis at 500 in a fresh process and requires the bump to produce 501.
