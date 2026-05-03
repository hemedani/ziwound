import type { ActFn } from "lesan";
import { country } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
	const {
		set: { page, limit, name, search },
		get,
	} = body.details;

	const pipeline = [];

	name &&
		pipeline.push({
			$match: {
				name: { $regex: new RegExp(name, "i") },
			},
		});

	search &&
		pipeline.push({
			$match: {
				$text: { $search: search },
			},
		});

	pipeline.push({ $sort: { _id: -1 } });
	pipeline.push({ $skip: (page - 1) * limit });
	pipeline.push({ $limit: limit });

	return await country
		.aggregation({
			pipeline,
			projection: get,
		})
		.toArray();
};
