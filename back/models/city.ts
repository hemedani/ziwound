import { coreApp } from "../mod.ts";
import { type RelationDataType, type RelationSortOrderType, string } from "lesan";
import { pure_location } from "@model";
import { location_excludes, user_excludes } from "./excludes.ts";

export const city_pure = {
	...pure_location,

	wars_history: string(),
	conflict_timeline: string(),
	casualties_info: string(),
	notable_battles: string(),
	occupation_info: string(),
	destruction_level: string(),
	civilian_impact: string(),
	mass_graves_info: string(),
	war_crimes_events: string(),
	liberation_info: string(),
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
				name: "text",
				english_name: "text",
				wars_history: "text",
				conflict_timeline: "text",
				war_crimes_events: "text",
				notable_battles: "text",
			},
		},
	});

