import { number, object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { geoJSONStruct } from "@model";

export const updateValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
			name: optional(string()),
			english_name: optional(string()),
			area: optional(geoJSONStruct("Polygon")),
			center: optional(geoJSONStruct("Point")),
			wars_history: optional(string()),
			conflict_timeline: optional(string()),
			casualties_info: optional(string()),
			notable_battles: optional(string()),
			occupation_info: optional(string()),
			destruction_level: optional(string()),
			civilian_impact: optional(string()),
			mass_graves_info: optional(string()),
			war_crimes_events: optional(string()),
			liberation_info: optional(string()),
		}),
		get: selectStruct("city", 1),
	});
};
