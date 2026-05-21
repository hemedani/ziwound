import {
	array,
	boolean,
	defaulted,
	object,
	objectIdValidation,
	optional,
	string,
} from "lesan";
import { selectStruct } from "../../../mod.ts";
import { user_genders, user_level_emums } from "@model";
import { localizedWarInfo } from "@model";

export const addUserValidator = () => {
	return object({
		set: object({
			first_name: string(),
			last_name: string(),
			gender: user_genders,
			birth_date: optional(string()),
			summary: optional(string()),
			address: optional(string()),
			level: user_level_emums,
			email: string(),
			password: string(),
			is_verified: defaulted(boolean(), false),
			bio: optional(localizedWarInfo),
			expertise: optional(array(string())),
			verified: defaulted(boolean(), false),
			verificationBadge: optional(string()),
			isPublic: defaulted(boolean(), true),
			nationalCard: optional(objectIdValidation),
			avatar: optional(objectIdValidation),
			provinceId: optional(objectIdValidation),
			cityId: optional(objectIdValidation),
			countryId: optional(objectIdValidation),
		}),
		get: selectStruct("user", 1),
	});
};
