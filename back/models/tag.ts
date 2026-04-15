import { coreApp } from "../mod.ts";
import {
	createSharedRelations,
	shared_relation_pure,
} from "./utils/sharedRelations.ts";

export const tags = () =>
	coreApp.odm.newModel(
		"tag",
		shared_relation_pure,
		createSharedRelations(),
		{
			createIndex: {
				indexSpec: {
					name: "text",
					description: "text",
				},
			},
		},
	);
