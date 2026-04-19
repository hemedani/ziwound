import { object, optional, string, objectIdValidation } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const updateValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
			alt_text: optional(string()),
		}),
		get: selectStruct("file", 2),
	});
};
