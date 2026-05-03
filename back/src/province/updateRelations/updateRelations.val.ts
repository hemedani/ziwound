import { object, objectIdValidation, optional } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const updateRelationsValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
			country: optional(objectIdValidation),
		}),
		get: selectStruct("province", 2),
	});
};
