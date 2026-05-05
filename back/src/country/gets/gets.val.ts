import { enums, number, object, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { pagination } from "@lib";

export const getsValidator = () => {
	return object({
		set: object({
			...pagination,
			// Text search
			search: optional(string()),
			// Filters
			name: optional(string()),
			// Sort options
			sortBy: optional(enums(["createdAt", "updatedAt", "name", "english_name"])),
			sortOrder: optional(enums(["asc", "desc"])),
		}),
		get: selectStruct("country", 2),
	});
};
