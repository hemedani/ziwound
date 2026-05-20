import { type ActFn, ObjectId } from "lesan";
import { country } from "../../../mod.ts";

export const updateRelationsFn: ActFn = async (body) => {
	const {
		set: { _id, photo },
		get,
	} = body.details;

	const countryId = new ObjectId(_id as string);

	if (photo) {
		await country.addRelation({
			filters: { _id: countryId },
			relations: {
				photo: {
					_ids: new ObjectId(photo),
				},
			},
			projection: get,
			replace: true,
		});
	}

	return await country.findOne({
		filters: { _id: countryId },
		projection: get,
	});
};
