import { createLazyClient, parseURL, type Redis } from "@db/redis";

/**
 * Two-tier cache for expensive, publicly visible read models — currently the
 * landing page payload.
 *
 * - **L1** is a small in-process `Map`. It is always available and costs nothing.
 * - **L2** is Redis, configured through `REDIS_URL`. It is shared between
 *   processes and survives a restart.
 *
 * Redis is *optional by design*. When `REDIS_URL` is unset, or the server cannot
 * be reached, every operation silently falls back to L1 — the landing page can
 * never be taken down by a missing or restarting Redis. A failure also opens a
 * short circuit breaker, so we pay a connection attempt once every 30s instead of
 * on every request.
 *
 * Invalidation is version based. Each namespace (`landing`) has a counter, and
 * every key embeds the current value (`landing:v3:fa`). Bumping the counter
 * orphans the whole namespace in one step; the abandoned entries are then
 * reclaimed by their own TTL. The counter lives in Redis when available so that
 * several processes share it, and in memory otherwise.
 */

const REDIS_URL = Deno.env.get("REDIS_URL")?.trim() ?? "";
const KEY_PREFIX = (Deno.env.get("CACHE_KEY_PREFIX")?.trim() || "ziwound")
  .replace(/:+$/, "");

/** Cap on L1 entries; expired entries are swept before anything is evicted. */
const L1_MAX_ENTRIES = 256;
/** TTL applied when an L2 hit is promoted into L1. */
const L1_PROMOTED_TTL_SECONDS = 30;
/** Upper bound on a single Redis round-trip. */
const REDIS_OP_TIMEOUT_MS = 1_500;
/** Upper bound on establishing a Redis connection. */
const REDIS_CONNECT_TIMEOUT_MS = 2_000;
/** How long to stop talking to Redis after a failure. */
const REDIS_RETRY_AFTER_MS = 30_000;
/** Sentinel meaning "this entry never expires". */
const NEVER = Number.POSITIVE_INFINITY;

interface L1Entry {
  value: unknown;
  /** Epoch milliseconds; {@link NEVER} means the entry never expires. */
  expiresAt: number;
}

const l1 = new Map<string, L1Entry>();
/** Local fallback for {@link namespaceVersion} while Redis is unavailable. */
const localVersions = new Map<string, number>();
/** De-duplicates concurrent cache misses for the same key. */
const inFlight = new Map<string, Promise<unknown>>();

let client: Redis | null = null;
let redisDisabledUntil = 0;
let redisWarningLogged = false;

// ---------------------------------------------------------------------------
// Redis plumbing
// ---------------------------------------------------------------------------

function openRedis(): Redis | null {
  if (!REDIS_URL) return null;
  if (Date.now() < redisDisabledUntil) return null;
  if (client) return client;

  try {
    client = createLazyClient({
      ...parseURL(REDIS_URL),
      // Give up quickly instead of retrying in the background for minutes.
      maxRetryCount: 1,
      // Bounds the connection handshake on Deno versions that support it; older
      // runtimes ignore the option and are covered by withTimeout() below.
      signal: () => AbortSignal.timeout(REDIS_CONNECT_TIMEOUT_MS),
    });
  } catch (error) {
    suspendRedis("invalid REDIS_URL", error);
    return null;
  }
  return client;
}

function suspendRedis(reason: string, error?: unknown) {
  redisDisabledUntil = Date.now() + REDIS_RETRY_AFTER_MS;
  if (redisWarningLogged) return;
  redisWarningLogged = true;
  const detail = error instanceof Error ? error.message : error ? `${error}` : "";
  console.warn(
    `[cache] Redis unavailable (${reason}) — using the in-process cache for ` +
      `${REDIS_RETRY_AFTER_MS / 1000}s. ${detail}`,
  );
}

function resumeRedis() {
  redisWarningLogged = false;
  redisDisabledUntil = 0;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`timed out after ${ms}ms`)),
      ms,
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/** Runs one Redis command, tripping the breaker on any failure. */
async function redisOp<T>(
  label: string,
  run: (redis: Redis) => Promise<T>,
): Promise<T | null> {
  const redis = openRedis();
  if (!redis) return null;
  try {
    const result = await withTimeout(run(redis), REDIS_OP_TIMEOUT_MS);
    resumeRedis();
    return result;
  } catch (error) {
    suspendRedis(label, error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// L1
// ---------------------------------------------------------------------------

function l1Read<T>(key: string): T | null {
  const entry = l1.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    l1.delete(key);
    return null;
  }
  return entry.value as T;
}

function l1Write(key: string, value: unknown, ttlSeconds: number) {
  if (l1.size >= L1_MAX_ENTRIES) {
    for (const [existing, entry] of l1) {
      if (entry.expiresAt <= Date.now()) l1.delete(existing);
    }
    // Still full of live entries: drop the oldest insertions (Map preserves order).
    while (l1.size >= L1_MAX_ENTRIES) {
      const oldest = l1.keys().next().value;
      if (oldest === undefined) break;
      l1.delete(oldest);
    }
  }
  l1.set(key, {
    value,
    expiresAt: ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : NEVER,
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function scoped(key: string): string {
  return `${KEY_PREFIX}:${key}`;
}

/** Reads a value, preferring L1 and falling back to Redis. */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const local = l1Read<T>(key);
  if (local !== null) return local;

  const raw = await redisOp("GET", (redis) => redis.get(scoped(key)));
  if (raw === null || raw === undefined) return null;

  try {
    const parsed = JSON.parse(raw) as T;
    l1Write(key, parsed, L1_PROMOTED_TTL_SECONDS);
    return parsed;
  } catch {
    return null;
  }
}

/** Writes a value to both tiers. `ttlSeconds <= 0` means "never expires". */
export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds: number,
): Promise<void> {
  l1Write(key, value, ttlSeconds);
  let payload: string;
  try {
    payload = JSON.stringify(value);
  } catch {
    return;
  }
  await redisOp("SET", (redis) =>
    ttlSeconds > 0
      ? redis.set(scoped(key), payload, { ex: ttlSeconds })
      : redis.set(scoped(key), payload));
}

/** Removes keys from both tiers. */
export async function cacheDel(keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  for (const key of keys) l1.delete(key);
  await redisOp("DEL", (redis) => redis.del(...keys.map(scoped)));
}

/**
 * Atomically increments a counter key and returns its new value, or `null` when
 * Redis is unavailable (so the caller can fall back to a local counter).
 */
export async function cacheIncr(key: string): Promise<number | null> {
  const raw = await redisOp("INCR", (redis) => redis.incr(scoped(key)));
  if (raw === null || raw === undefined) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

/**
 * Returns the cached value for `key`, computing and storing it on a miss.
 * Concurrent misses for the same key share one computation.
 */
export async function cacheReadThrough<T>(
  key: string,
  ttlSeconds: number,
  compute: () => Promise<T>,
): Promise<T> {
  const hit = await cacheGet<T>(key);
  if (hit !== null) return hit;

  const pending = inFlight.get(key);
  if (pending) return await pending as T;

  const run = (async () => {
    const value = await compute();
    await cacheSet(key, value, ttlSeconds);
    return value;
  })();

  inFlight.set(key, run);
  try {
    return await run as T;
  } finally {
    inFlight.delete(key);
  }
}

// ---------------------------------------------------------------------------
// Versioned namespaces
// ---------------------------------------------------------------------------

const versionKey = (namespace: string) => `nsver:${namespace}`;

/**
 * Current version of a namespace.
 *
 * Redis is the source of truth when reachable so that every process invalidates
 * together; the in-memory counter is the fallback. The version only ever moves
 * forward — when Redis is behind (empty, or a process bumped while Redis was
 * down) the local value is published instead, so the processes re-converge.
 */
export async function namespaceVersion(namespace: string): Promise<number> {
  const local = localVersions.get(namespace) ?? 1;
  const raw = await redisOp(
    "GET",
    (redis) => redis.get(scoped(versionKey(namespace))),
  );
  const remote = raw === null || raw === undefined ? NaN : Number(raw);

  if (Number.isFinite(remote) && remote >= local) {
    localVersions.set(namespace, remote);
    return remote;
  }

  // Redis has no version yet (or is behind us): publish ours so that every
  // process agrees on which keys are current.
  localVersions.set(namespace, local);
  await cacheSet(versionKey(namespace), local, 0);
  return local;
}

/**
 * Orphans every key in the namespace by moving it to the next version.
 *
 * The next version comes from Redis `INCR` rather than from the local counter.
 * That matters: after a restart, or in a process that has not served a cached
 * read yet, the local counter is empty while Redis may already hold a much
 * higher value — a bump derived from the local counter would then fail to move
 * the shared version at all (leaving a stale payload live), or even move it
 * backwards (resurrecting very old entries).
 */
export async function bumpNamespace(namespace: string): Promise<void> {
  const bumped = await cacheIncr(versionKey(namespace));
  if (bumped !== null) {
    localVersions.set(
      namespace,
      Math.max(bumped, (localVersions.get(namespace) ?? 0) + 1),
    );
    return;
  }
  // Redis unavailable: advance the in-process counter only. Other processes
  // keep their own version and catch up through the namespace TTL.
  localVersions.set(namespace, (localVersions.get(namespace) ?? 1) + 1);
}

/** Builds a cache key that is automatically invalidated with its namespace. */
export async function versionedCacheKey(
  namespace: string,
  ...parts: string[]
): Promise<string> {
  const version = await namespaceVersion(namespace);
  return [`${namespace}:v${version}`, ...parts].join(":");
}

/** Introspection for health checks and logs. */
export function cacheStatus(): {
  redisConfigured: boolean;
  redisActive: boolean;
  l1Entries: number;
} {
  return {
    redisConfigured: REDIS_URL.length > 0,
    redisActive: Boolean(client) && Date.now() >= redisDisabledUntil,
    l1Entries: l1.size,
  };
}
