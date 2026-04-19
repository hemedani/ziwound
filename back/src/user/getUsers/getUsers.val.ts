import { array, enums, number, object, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { user_level_array } from "@model";
import { pagination } from "@lib";

export const getUsersValidator = () => {
	return object({
		set: object({
			...pagination,
			// Text search
			search: optional(string()),
			// Filters
			level: optional(enums(user_level_array)),
			levels: optional(array(enums(user_level_array))),
			isVerified: optional(enums(["true", "false", "all"])),
			gender: optional(enums(["Male", "Female"])),
			// Sort options
			sortBy: optional(enums(["createdAt", "updatedAt", "first_name", "last_name", "email", "level"])),
			sortOrder: optional(enums(["asc", "desc"])),
		}),
		get: selectStruct("user", 2),
	});
};
