import {
	array,
	boolean,
	object,
	objectIdValidation,
	optional,
	string,
} from "lesan";
import { selectStruct } from "../../../mod.ts";
import { user_genders, user_level_emums } from "@model";
import { localizedWarInfo } from "@model";

export const updateUserValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
			first_name: optional(string()),
			last_name: optional(string()),
			gender: optional(user_genders),
			birth_date: optional(string()),
			summary: optional(string()),
			address: optional(string()),
			level: optional(user_level_emums),
			email: optional(string()),
			password: optional(string()),
			is_verified: optional(boolean()),
			bio: optional(localizedWarInfo),
			expertise: optional(array(string())),
			verified: optional(boolean()),
			verificationBadge: optional(string()),
			isPublic: optional(boolean()),
		}),
		get: selectStruct("user", 1),
	});
};
