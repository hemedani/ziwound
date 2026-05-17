import { number, object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { geoJSONStruct, localizedWarInfo } from "@model";

export const updateValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
			name: optional(string()),
			english_name: optional(string()),
			area: optional(geoJSONStruct("Polygon")),
			center: optional(geoJSONStruct("Point")),
			countryId: optional(objectIdValidation),
			wars_history: optional(localizedWarInfo),
			conflict_timeline: optional(localizedWarInfo),
			casualties_info: optional(localizedWarInfo),
			notable_battles: optional(localizedWarInfo),
			occupation_info: optional(localizedWarInfo),
			destruction_level: optional(localizedWarInfo),
			civilian_impact: optional(localizedWarInfo),
			mass_graves_info: optional(localizedWarInfo),
			war_crimes_events: optional(localizedWarInfo),
			liberation_info: optional(localizedWarInfo),
		}),
		get: selectStruct("city", 1),
	});
};
