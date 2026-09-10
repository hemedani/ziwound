import {
  enums,
  object,
  objectIdValidation,
  optional,
  string,
} from "lesan";
import { selectStruct } from "../../../mod.ts";
import { regional_manager_request_area_type_array, user_pure } from "@model";

export const registerUserValidator = () => {
	const {
		level: _level,
		is_verified: _is_verified,
		isRegionalManager: _isRegionalManager,
		...rest
	} = user_pure;

	return object({
		set: object({
			...rest,
			avatarId: optional(objectIdValidation),
			regionalAreaType: optional(
				enums(regional_manager_request_area_type_array),
			),
			regionalCountryId: optional(objectIdValidation),
			regionalProvinceId: optional(objectIdValidation),
			regionalCityId: optional(objectIdValidation),
			regionalJustification: optional(string()),
		}),
		get: selectStruct("user", 1),
	});
};
