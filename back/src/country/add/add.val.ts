import { object, objectIdValidation, optional } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { country_pure } from "@model";

export const addValidator = () => {
	return object({
		set: object({
			...country_pure,
			photoId: optional(objectIdValidation),
		}),
		get: selectStruct("country", 1),
	});
};
