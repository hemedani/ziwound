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
			international_response: optional(string()),
			war_crimes_documentation: optional(string()),
			human_rights_violations: optional(string()),
			genocide_info: optional(string()),
			chemical_weapons_info: optional(string()),
			displacement_info: optional(string()),
			reconstruction_status: optional(string()),
			international_sanctions: optional(string()),
			notable_war_events: optional(string()),
		}),
		get: selectStruct("country", 1),
	});
};
