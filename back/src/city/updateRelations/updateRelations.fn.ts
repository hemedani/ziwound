import { type ActFn, ObjectId } from "lesan";
import { city } from "../../../mod.ts";

export const updateRelationsFn: ActFn = async (body) => {
	const {
		set: { _id, province, country },
		get,
	} = body.details;

	const cityId = new ObjectId(_id as string);

	if (province) {
		await city.addRelation({
			filters: { _id: cityId },
			relations: {
				province: {
					_ids: new ObjectId(province),
					relatedRelations: {
						cities: true,
						capital: false,
					},
				},
			},
			projection: get,
			replace: true,
		});
	}

	if (country) {
		await city.addRelation({
			filters: { _id: cityId },
			relations: {
				country: {
					_ids: new ObjectId(country),
					relatedRelations: {
						cities: true,
					},
				},
			},
			projection: get,
			replace: true,
		});
	}

	return await city.findOne({
		filters: { _id: cityId },
		projection: get,
	});
};
