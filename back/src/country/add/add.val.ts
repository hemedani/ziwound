import { object, objectIdValidation } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { country_pure } from "@model";

export const addValidator = () => {
	return object({
		set: object({
			...country_pure,
		}),
		get: selectStruct("country", 1),
	});
};
