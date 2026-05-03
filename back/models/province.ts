import { coreApp } from "../mod.ts";
import { type RelationDataType, type RelationSortOrderType } from "lesan";
import { pure_location, location_excludes } from "@model";
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
	country: {
		schemaName: "country",
		type: "single" as RelationDataType,
		optional: true,
		excludes: location_excludes,
		relatedRelations: {
			provinces: {
				type: "multiple" as RelationDataType,
				excludes: location_excludes,
				limit: 100,
				sort: {
					field: "_id",
					order: "desc" as RelationSortOrderType,
				},
			},
		},
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
