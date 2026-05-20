import { object, objectIdValidation, optional } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const updateRelationsValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
			photo: optional(objectIdValidation),
		}),
		get: selectStruct("country", 2),
	});
};