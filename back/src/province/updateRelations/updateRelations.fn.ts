import { type ActFn, ObjectId } from "lesan";
import { province } from "../../../mod.ts";

export const updateRelationsFn: ActFn = async (body) => {
	const {
		set: { _id, country },
		get,
	} = body.details;

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

	return await province.findOne({
		filters: { _id: provinceId },
		projection: get,
	});
};
