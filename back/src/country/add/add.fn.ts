import { type ActFn, ObjectId } from "lesan";
import { coreApp, country } from "../../../mod.ts";
import type { MyContext } from "@lib";

export const addFn: ActFn = async (body) => {
	const { set, get } = body.details;
	const { user }: MyContext = coreApp.contextFns
		.getContextModel() as unknown as MyContext;

	const { photoId, ...rest } = set;

	return await country.insertOne({
		doc: rest,
		relations: {
			registrar: {
				_ids: user._id,
			},
			...(photoId && {
				photo: {
					_ids: new ObjectId(photoId as string),
				},
			}),
		},
		projection: get,
	});
};
