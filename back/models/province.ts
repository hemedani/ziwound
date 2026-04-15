import { coreApp } from "../mod.ts";
import { type RelationDataType } from "@deps";
import { pure_location } from "@model";
import { user_excludes } from "./excludes.ts";

export const province_pure = { ...pure_location };

export const province_relations = {
	registrar: {
		schemaName: "user",
		type: "single" as RelationDataType,
		optional: true,
		excludes: user_excludes,
		relatedRelations: {},
	},
};

export const provinces = () =>
	coreApp.odm.newModel("province", province_pure, province_relations, {
		createIndex: {
			indexSpec: {
				area: "2dsphere",
				center_location: "2dsphere",
			},
		},
	});
