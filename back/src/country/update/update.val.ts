import { object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { localizedWarInfo } from "@model";

export const updateValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
			name: optional(string()),
			english_name: optional(string()),
			wars_history: optional(localizedWarInfo),
			conflict_timeline: optional(localizedWarInfo),
			casualties_info: optional(localizedWarInfo),
			international_response: optional(localizedWarInfo),
			war_crimes_documentation: optional(localizedWarInfo),
			human_rights_violations: optional(localizedWarInfo),
			genocide_info: optional(localizedWarInfo),
			chemical_weapons_info: optional(localizedWarInfo),
			displacement_info: optional(localizedWarInfo),
			reconstruction_status: optional(localizedWarInfo),
			international_sanctions: optional(localizedWarInfo),
			notable_war_events: optional(localizedWarInfo),
		}),
		get: selectStruct("country", 1),
	});
};
