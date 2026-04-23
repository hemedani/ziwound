import { array, enums, object, objectIdValidation, optional, string, date, number } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { language_array, report_status_array } from "@model";
import { pagination } from "@lib";

export const getsValidator = () => {
	return object({
		set: object({
			...pagination,
			// Text search
			search: optional(string()),
			// Filters
			status: optional(enums(report_status_array)),
			priority: optional(enums(["Low", "Medium", "High"])),
			language: optional(enums(language_array)),
			categoryIds: optional(array(objectIdValidation)),
			tagIds: optional(array(objectIdValidation)),
			userIds: optional(array(objectIdValidation)),
			// Date range filters
			createdAtFrom: optional(date()),
			createdAtTo: optional(date()),
			// Geospatial filters
			nearLng: optional(number()),
			nearLat: optional(number()),
			maxDistance: optional(number()), // in meters
			bbox: optional(array(number())), // [minLng, minLat, maxLng, maxLat]
			// Sort options
			sortBy: optional(enums(["createdAt", "updatedAt", "title", "status", "priority"])),
			sortOrder: optional(enums(["asc", "desc"])),
		}),
		get: selectStruct("report", 2),
	});
};
