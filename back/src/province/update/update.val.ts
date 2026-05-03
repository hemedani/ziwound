import { object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const updateValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
			name: optional(string()),
			english_name: optional(string()),
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
		get: selectStruct("province", 1),
	});
};
