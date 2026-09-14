import type { ActFn } from "lesan";
import { ObjectId } from "lesan";
import { escapeRegex } from "@lib";
import { province } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
	const {
		set: {
			page,
			limit,
			skip,
			search,
			name,
			countryIds,
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

	// Name filter (regex search on native name OR english name)
	if (name) {
		const nameRegex = new RegExp(escapeRegex(name), "i");
		pipeline.push({
			$match: {
				$or: [
					{ name: { $regex: nameRegex } },
					{ english_name: { $regex: nameRegex } },
				],
			},
		});
	}

	// Country filter
	if (countryIds && countryIds.length > 0) {
		pipeline.push({
			$match: {
				"country._id": {
					$in: countryIds.map((id: string) => new ObjectId(id)),
				},
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

	return await province
		.aggregation({
			pipeline,
			projection: get,
		})
		.toArray();
};
