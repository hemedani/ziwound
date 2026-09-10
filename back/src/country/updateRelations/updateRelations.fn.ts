import { type ActFn, ObjectId } from "lesan";
import { coreApp, country } from "../../../mod.ts";
import { assertAreaAccess } from "@lib";
import type { MyContext } from "@lib";

export const updateRelationsFn: ActFn = async (body) => {
	const {
		set: { _id, photo },
		get,
	} = body.details;

	const { user }: MyContext = coreApp.contextFns
		.getContextModel() as unknown as MyContext;

	await assertAreaAccess(user, "Country", _id as string);

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
