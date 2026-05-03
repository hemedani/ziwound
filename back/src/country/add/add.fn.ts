import { type ActFn } from "lesan";
import { coreApp, country } from "../../../mod.ts";
import type { MyContext } from "@lib";

export const addFn: ActFn = async (body) => {
	const { set, get } = body.details;
	const { user }: MyContext = coreApp.contextFns
		.getContextModel() as unknown as MyContext;

	return await country.insertOne({
		doc: set,
		relations: {
			registrar: {
				_ids: user._id,
			},
		},
		projection: get,
	});
};
