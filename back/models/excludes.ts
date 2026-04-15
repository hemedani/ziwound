/**
 * Centralized file for all model excludes to prevent circular dependencies
 */

// File model excludes
export const file_excludes: (string)[] = [
  "createdAt",
  "updatedAt",
  "size",
];

// User model excludes
export const user_excludes: (string)[] = [
  "createdAt",
  "updatedAt",
  "father_name",
  "birth_date",
  "summary",
];

// Location model excludes
export const location_excludes: (string)[] = [
  "area",
  "center",
];

// Shared relation model excludes
export const shared_relation_excludes: (string)[] = [
  "createdAt",
  "updatedAt",
  "description",
];

// Place model excludes
export const place_excludes: (string)[] = [
  "center",
  "area",
  "createdAt",
  "updatedAt",
  "meta",
];

// Comment model excludes
export const comment_excludes: (string)[] = [
  "createdAt",
  "updatedAt",
];

// Virtual tour model excludes
export const virtual_tour_excludes: (string)[] = [
  "createdAt",
  "updatedAt",
  "description",
  "hotspots",
];
