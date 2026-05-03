import { type ActFn, ObjectId } from "lesan";
import { coreApp, province } from "../../../mod.ts";
import type { MyContext } from "@lib";

export const addFn: ActFn = async (body) => {
	const { set, get } = body.details;
	const { user }: MyContext = coreApp.contextFns
		.getContextModel() as unknown as MyContext;

	const { countryId, ...rest } = set;

	return await province.insertOne({
		doc: rest,
		relations: {
			registrar: {
				_ids: user._id,
			},
			...(countryId && {
				country: {
					_ids: new ObjectId(countryId as string),
					relatedRelations: {
						provinces: true,
					},
				},
			}),
		},
		projection: get,
	});
};
