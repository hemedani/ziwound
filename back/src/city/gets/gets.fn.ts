import { type ActFn, ObjectId } from "@deps";
import { city } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
	const {
		set: { page, limit, name, provinceId },
		get,
	} = body.details;

	const pipeline = [];

	name &&
		pipeline.push({
			$match: {
				name: { $regex: new RegExp(name, "i") },
			},
		});

	provinceId &&
		pipeline.push({
			$match: {
				"province._id": new ObjectId(provinceId as string),
			},
		});

	pipeline.push({ $sort: { _id: -1 } });
	pipeline.push({ $skip: (page - 1) * limit });
	pipeline.push({ $limit: limit });

	return await city
		.aggregation({
			pipeline,
			projection: get,
		})
		.toArray();
};
