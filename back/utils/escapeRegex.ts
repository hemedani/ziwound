/**
 * Escapes every RegExp metacharacter in a user supplied string so it can be
 * safely embedded in a `new RegExp(...)` search filter.
 *
 * Without this, location names containing characters such as `(`, `)`, `.`
 * or `+` (e.g. "Cocos (Keeling) Islands", "Washington, D.C.") would either
 * throw an invalid-regex error or match unintended documents.
 */
export const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
