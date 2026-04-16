import { boolean, object, objectIdValidation, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";

export const removeValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
			hardCascade: optional(boolean()),
		}),
		get: selectStruct("report", 1),
	});
};
