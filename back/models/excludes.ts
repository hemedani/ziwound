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

// Shared relation model excludes
export const shared_relation_excludes: (string)[] = [
  "createdAt",
  "updatedAt",
  "description",
];

// Location model excludes (for city, province, country)
export const location_excludes: (string)[] = [
  "createdAt",
  "updatedAt",
  "wars_history",
  "conflict_timeline",
  "casualties_info",
  "notable_battles",
  "occupation_info",
  "destruction_level",
  "civilian_impact",
  "mass_graves_info",
  "war_crimes_events",
  "liberation_info",
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

// Report model excludes
export const report_excludes: (string)[] = [
  "createdAt",
  "updatedAt",
];

// Document model excludes
export const document_excludes: (string)[] = [
  "createdAt",
  "updatedAt",
];
