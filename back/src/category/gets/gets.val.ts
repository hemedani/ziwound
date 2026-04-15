import { enums, object, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";
import { pagination } from "@lib";

export const getsValidator = () => {
	return object({
		set: object({
			...pagination,
			// Text search
			search: optional(string()),
			// Sort options
			sortBy: optional(enums(["createdAt", "updatedAt", "name"])),
			sortOrder: optional(enums(["asc", "desc"])),
		}),
		get: selectStruct("category", 2),
	});
};
