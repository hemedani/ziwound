import { type ActFn, ObjectId } from "@deps";
import { city, coreApp } from "../../../mod.ts";
import type { MyContext } from "@lib";

export const addFn: ActFn = async (body) => {
	const { set, get } = body.details;
	const { user }: MyContext = coreApp.contextFns
		.getContextModel() as MyContext;

	const { provinceId, isCapital, ...rest } = set;

	return await city.insertOne({
		doc: rest,
		relations: {
			registrar: {
				_ids: user._id,
			},
			province: {
				_ids: new ObjectId(provinceId as string),
				relatedRelations: {
					cities: true,
					capital: isCapital,
				},
			},
		},
		projection: get,
	});
};
