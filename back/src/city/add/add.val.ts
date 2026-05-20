import { boolean, object, objectIdValidation, optional } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { city_pure } from "@model";

export const addValidator = () => {
	return object({
		set: object({
			...city_pure,
			provinceId: objectIdValidation,
			countryId: objectIdValidation,
			isCapital: boolean(),
			photoId: optional(objectIdValidation),
		}),
		get: selectStruct("city", 1),
	});
};
