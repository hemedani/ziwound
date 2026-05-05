import { type ActFn, ObjectId } from "lesan";
import { city } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
	const {
		set: {
			page,
			limit,
			skip,
			search,
			name,
			provinceId,
			countryId,
			sortBy,
			sortOrder,
		},
		get,
	} = body.details;

	const pipeline: any[] = [];

	// Text search using MongoDB text index
	if (search) {
		pipeline.push({
			$match: { $text: { $search: search } },
		});
	}

	// Name filter (regex search)
	if (name) {
		pipeline.push({
			$match: {
				name: { $regex: new RegExp(name, "i") },
			},
		});
	}

	// Province filter
	if (provinceId) {
		pipeline.push({
			$match: {
				"province._id": new ObjectId(provinceId as string),
			},
		});
	}

	// Country filter
	if (countryId) {
		pipeline.push({
			$match: {
				"country._id": new ObjectId(countryId as string),
			},
		});
	}

	// Add text search score for sorting if search term exists
	if (search && (!sortBy || sortBy === "relevance")) {
		pipeline.push({
			$addFields: {
				textScore: { $meta: "textScore" },
			},
		});
	}

	// Sorting
	const sortField = sortBy === "relevance" ? "textScore" : (sortBy || "_id");
	const sortDirection = sortOrder === "asc" ? 1 : -1;
	pipeline.push({ $sort: { [sortField]: sortDirection } });

	// Pagination
	const calculatedSkip = skip ?? limit * (page - 1);
	pipeline.push({ $skip: calculatedSkip });
	pipeline.push({ $limit: limit });

	return await city
		.aggregation({
			pipeline,
			projection: get,
		})
		.toArray();
};
