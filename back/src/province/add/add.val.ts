import { object, objectIdValidation, optional } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { province_pure } from "@model";

export const addValidator = () => {
	return object({
		set: object({
			...province_pure,
			countryId: optional(objectIdValidation),
		}),
		get: selectStruct("province", 1),
	});
};
