import type { ActFn, Document } from "lesan";
import { ObjectId } from "lesan";
import { report } from "../../../mod.ts";

export const countFn: ActFn = async (body) => {
	const {
		set: {
			status,
			priority,
			language,
			categoryId,
			country,
			city,
			createdAtFrom,
			createdAtTo,
		},
		get,
	} = body.details;

	const filters: Document = {};

	status && (filters["status"] = status);
	priority && (filters["priority"] = priority);
	language && (filters["language"] = language);
	country && (filters["country"] = country);
	city && (filters["city"] = city);
	categoryId && (filters["category._id"] = new ObjectId(categoryId));
	createdAtFrom && (filters["createdAt"] = { $gte: createdAtFrom });
	createdAtTo && (filters["createdAt"] = { ...filters["createdAt"] as object, $lte: createdAtTo });

	const foundedItemsLength = await report.countDocument({
		filter: filters,
	});

	return { qty: foundedItemsLength };
};
