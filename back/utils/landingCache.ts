import type { ActFn, ActInp } from "lesan";
import { bumpNamespace, versionedCacheKey } from "./cache.ts";

/**
 * Cache configuration for the public landing page.
 *
 * The landing page is the busiest route in the app and its payload is identical
 * for every visitor using the same locale, so it is cached per locale and
 * invalidated whenever content that appears on it changes.
 */

/** Cache namespace; bumping it invalidates every locale at once. */
export const LANDING_NAMESPACE = "landing";

/**
 * Backstop expiry. Invalidation is explicit (see {@link withLandingInvalidation}),
 * so this only bounds how long a missed invalidation can stay visible — for
 * example when a second backend process bumps its own counter.
 */
export const LANDING_TTL_SECONDS = 300;

/** Cache key for one locale's landing payload. */
export const landingCacheKey = (locale: string) =>
  versionedCacheKey(LANDING_NAMESPACE, locale);

/**
 * Drops every cached landing payload. Cheap (one counter bump) and never throws,
 * so it is safe to call from a mutation on the request path.
 */
export const invalidateLanding = () => bumpNamespace(LANDING_NAMESPACE);

/**
 * Mutation acts whose result is visible on the landing page.
 *
 * The landing page shows hero slides, the four newest approved reports, the four
 * newest blog posts, eight countries with their province/city totals, and
 * counters for reports/documents/countries/cities/provinces/users/war criminals.
 * Any act that can change one of those has to invalidate the cache.
 *
 * Reads (`gets`, `get`, `count`, `statistics`) are deliberately absent.
 */
const LANDING_AFFECTING_ACTS: Readonly<Record<string, readonly string[]>> = {
  heroSlide: ["add", "update", "remove"],
  report: ["add", "update", "remove", "updateStatus", "updateRelations"],
  blogPost: ["add", "update", "remove", "publish", "unpublish"],
  warCriminal: ["add", "update", "remove", "updateRelations"],
  document: ["add", "update", "remove", "updateRelations"],
  // A renamed file changes the image URL rendered inside a hero slide or a
  // featured report, so updates count. `uploadFile` does not — nothing points at
  // a new file until a report references it, and invalidating on every upload
  // would thrash the cache while a report is being written.
  file: ["update"],
  // The world importer calls these thousands of times; each call is a cheap
  // counter bump, and afterwards the next visitor repopulates the cache.
  country: ["add", "addMany", "update", "remove", "updateRelations"],
  province: ["add", "addMany", "update", "remove", "updateRelations"],
  city: ["add", "addMany", "update", "remove", "updateRelations"],
  // The landing page counts every user, so registrations move the counter.
  // Note the act names do not always match their folder — `registerUser` lives
  // in `src/user/register/`.
  user: ["addUser", "registerUser", "tempUser", "removeUser"],
};

/** True when running this act can change what the landing page renders. */
export function affectsLandingPage(schema: string, actName: string): boolean {
  return LANDING_AFFECTING_ACTS[schema]?.includes(actName) ?? false;
}

/**
 * Returns the act names above that are not actually registered.
 *
 * Act names do not always match their folder (`registerUser` lives in
 * `src/user/register/`), and a typo here would silently stop invalidating the
 * cache — the page would quietly go stale until the TTL expired. This is called
 * once at boot so the mistake shows up in the logs instead.
 */
export function missingLandingActs(
  isRegistered: (schema: string, actName: string) => boolean,
): string[] {
  const missing: string[] = [];
  for (const [schema, actNames] of Object.entries(LANDING_AFFECTING_ACTS)) {
    for (const actName of actNames) {
      if (!isRegistered(schema, actName)) missing.push(`${schema}.${actName}`);
    }
  }
  return missing;
}

/**
 * Wraps a mutation act so that a successful run invalidates the landing cache.
 *
 * Acts are wrapped at registration time (see `mod.ts`) rather than edited one by
 * one: there are ~27 of them, and a future mutation act would otherwise silently
 * be missed. Reads are returned untouched.
 */
export function withLandingInvalidation(inp: ActInp): ActInp {
  if (!affectsLandingPage(inp.schema, inp.actName)) return inp;

  const run: ActFn = inp.fn;
  return {
    ...inp,
    fn: async (body) => {
      const result = await run(body);
      // Only reached when the mutation succeeded; `invalidateLanding` swallows
      // Redis errors, so a cache problem can never fail the mutation itself.
      await invalidateLanding();
      return result;
    },
  };
}
