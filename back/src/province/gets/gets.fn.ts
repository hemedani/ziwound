import type { ActFn } from "lesan";
import { ObjectId } from "lesan";
import { province } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
	const {
		set: { page, limit, name, countryId },
		get,
	} = body.details;

	const pipeline = [];

	name &&
		pipeline.push({
			$match: {
				name: { $regex: new RegExp(name, "i") },
			},
		});

	countryId &&
		pipeline.push({
			$match: {
				"country._id": new ObjectId(countryId as string),
			},
		});

	pipeline.push({ $sort: { _id: -1 } });
	pipeline.push({ $skip: (page - 1) * limit });
	pipeline.push({ $limit: limit });

	return await province
		.aggregation({
			pipeline,
			projection: get,
		})
		.toArray();
};
