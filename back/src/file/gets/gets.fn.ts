import type { ActFn, Document } from "@deps";
import { file } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
	const {
		set: {
			page,
			limit,
			skip,
			search,
			sortBy,
			sortOrder,
		},
		get,
	} = body.details;

	const pipeline: Document[] = [];

	// Text search using MongoDB text index
	search &&
		pipeline.push({
			$match: { $text: { $search: search } },
		});

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

	return await file
		.aggregation({
			pipeline,
			projection: get,
		})
		.toArray();
};
