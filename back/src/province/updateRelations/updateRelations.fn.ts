import { type ActFn, ObjectId } from "lesan";
import { coreApp, province } from "../../../mod.ts";
import { assertAreaAccess } from "@lib";
import type { MyContext } from "@lib";

export const updateRelationsFn: ActFn = async (body) => {
	const {
		set: { _id, country, photo },
		get,
	} = body.details;

	const { user }: MyContext = coreApp.contextFns
		.getContextModel() as unknown as MyContext;

	await assertAreaAccess(user, "Province", _id as string);

	const provinceId = new ObjectId(_id as string);

	if (country) {
		await province.addRelation({
			filters: { _id: provinceId },
			relations: {
				country: {
					_ids: new ObjectId(country),
					relatedRelations: {
						provinces: true,
					},
				},
			},
			projection: get,
			replace: true,
		});
	}

	if (photo) {
		await province.addRelation({
			filters: { _id: provinceId },
			relations: {
				photo: {
					_ids: new ObjectId(photo),
				},
			},
			projection: get,
			replace: true,
		});
	}

	return await province.findOne({
		filters: { _id: provinceId },
		projection: get,
	});
};
