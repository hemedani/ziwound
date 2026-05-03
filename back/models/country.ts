import { coreApp } from "../mod.ts";
import { type RelationDataType, string } from "lesan";
import { geoJSONStruct, location_excludes, user_excludes } from "@model";
import { createUpdateAt } from "../utils/createUpdateAt.ts";

export const country_pure = {
	name: string(),
	english_name: string(),

	area: geoJSONStruct("MultiPolygon"),
	center: geoJSONStruct("Point"),

	wars_history: string(),
	conflict_timeline: string(),
	casualties_info: string(),
	international_response: string(),
	war_crimes_documentation: string(),
	human_rights_violations: string(),
	genocide_info: string(),
	chemical_weapons_info: string(),
	displacement_info: string(),
	reconstruction_status: string(),
	international_sanctions: string(),
	notable_war_events: string(),

	...createUpdateAt,
};

export const country_relations = {
	registrar: {
		schemaName: "user",
		type: "single" as RelationDataType,
		optional: true,
		excludes: user_excludes,
		relatedRelations: {},
	},
};

export const countries = () =>
	coreApp.odm.newModel("country", country_pure, country_relations, {
		createIndex: {
			indexSpec: {
				area: "2dsphere",
				center: "2dsphere",
				name: "text",
				english_name: "text",
				wars_history: "text",
				conflict_timeline: "text",
				war_crimes_documentation: "text",
				human_rights_violations: "text",
				genocide_info: "text",
				notable_war_events: "text",
			},
		},
	});
