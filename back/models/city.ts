import { coreApp } from "../mod.ts";
import { type RelationDataType, type RelationSortOrderType } from "@deps";
import { pure_location } from "@model";
import { location_excludes, user_excludes } from "./excludes.ts";

export const city_pure = {
	...pure_location,
	// native_area: geoJSONStruct("MultiPolygon"), // -- محدوده بومی (اگر متفاوت است)
	// non_native_area: geoJSONStruct("MultiPolygon"), // -- محدوده غیربومی (اگر متفاوت است)
	// population: number(),
	// area_number: number(),

	// ...createUpdateAt,
};

export const city_relations = {
	registrar: {
		schemaName: "user",
		type: "single" as RelationDataType,
		optional: true,
		excludes: user_excludes,
		relatedRelations: {},
	},
	province: {
		schemaName: "province",
		type: "single" as RelationDataType,
		optional: true,
		excludes: location_excludes,
		relatedRelations: {
			cities: {
				type: "multiple" as RelationDataType,
				excludes: location_excludes,
				limit: 50,
				sort: {
					field: "_id",
					order: "desc" as RelationSortOrderType,
				},
			},
			capital: {
				type: "single" as RelationDataType,
			},
		},
	},
};

export const cities = () =>
	coreApp.odm.newModel("city", city_pure, city_relations, {
		createIndex: {
			indexSpec: {
				area: "2dsphere",
				center_location: "2dsphere",
			},
		},
	});

