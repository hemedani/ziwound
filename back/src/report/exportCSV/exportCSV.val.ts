import { array, date, enums, number, object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { language_array, report_status_array } from "@model";

export const exportCSVValidator = () => {
	return object({
		set: object({
			// Text search
			search: optional(string()),
			// Filters
			status: optional(enums(report_status_array)),
			priority: optional(enums(["Low", "Medium", "High"])),
			language: optional(enums(language_array)),
			categoryIds: optional(array(objectIdValidation)),
			tagIds: optional(array(objectIdValidation)),
			userIds: optional(array(objectIdValidation)),
			// Text filters
			country: optional(string()),
			city: optional(string()),
			// Date range filters
			createdAtFrom: optional(date()),
			createdAtTo: optional(date()),
			crimeOccurredFrom: optional(date()),
			crimeOccurredTo: optional(date()),
			// Geospatial filters
			nearLng: optional(number()),
			nearLat: optional(number()),
			maxDistance: optional(number()), // in meters
			bbox: optional(array(number())), // [minLng, minLat, maxLng, maxLat]
			// Sort options
			sortBy: optional(enums(["createdAt", "updatedAt", "title", "status", "priority", "crime_occurred_at"])),
			sortOrder: optional(enums(["asc", "desc"])),
			// Limit for export
			limit: optional(number()),
		}),
		get: selectStruct("report", 2),
	});
};
