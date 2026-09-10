import { type ActFn, ObjectId } from "lesan";
import { city, coreApp } from "../../../mod.ts";
import { assertAreaAccess } from "@lib";
import type { MyContext } from "@lib";

export const updateRelationsFn: ActFn = async (body) => {
	const {
		set: { _id, province, country, photo },
		get,
	} = body.details;

	const { user }: MyContext = coreApp.contextFns
		.getContextModel() as unknown as MyContext;

	await assertAreaAccess(user, "City", _id as string);

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

	if (photo) {
		await city.addRelation({
			filters: { _id: cityId },
			relations: {
				photo: {
					_ids: new ObjectId(photo),
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
