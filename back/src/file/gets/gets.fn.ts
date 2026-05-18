import type { ActFn, Document } from "lesan";
import { ObjectId } from "lesan";
import { file } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
	const {
		set: {
			page,
			limit,
			skip,
			search,
			type,
			mimeType,
			uploaderId,
			minSize,
			maxSize,
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

	// File type filter
	if (type) {
		pipeline.push({ $match: { type } });
	}

	// MIME type filter (exact match or prefix match)
	if (mimeType) {
		pipeline.push({ $match: { mimeType } });
	}

	// Uploader filter
	if (uploaderId) {
		pipeline.push({ $match: { "uploader._id": new ObjectId(uploaderId) } });
	}

	// Size range filters
	if (minSize !== undefined || maxSize !== undefined) {
		const sizeFilter: Document = {};
		if (minSize !== undefined) sizeFilter.$gte = minSize;
		if (maxSize !== undefined) sizeFilter.$lte = maxSize;
		pipeline.push({ $match: { size: sizeFilter } });
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

	return await file
		.aggregation({
			pipeline,
			projection: get,
		})
		.toArray();
};
