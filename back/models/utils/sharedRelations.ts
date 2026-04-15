import { optional, RelationDataType, string } from "@deps";
import { createUpdateAt } from "../../utils/createUpdateAt.ts";
import { user_excludes } from "../excludes.ts";

export const shared_relation_pure = {
	name: string(),
	description: string(),

	// --- NEW FIELDS ---
	color: optional(string()), // E.g., "#FF5733"
	icon: optional(string()), // E.g., "museum-icon.svg" or a name like "museum"

	...createUpdateAt,
};

export const createSharedRelations = () => ({
	registrar: {
		schemaName: "user",
		type: "single" as RelationDataType,
		excludes: user_excludes,
		optional: true,
		relatedRelations: {},
	},
});
