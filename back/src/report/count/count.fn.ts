import type { ActFn, Document } from "lesan";
import { report } from "../../../mod.ts";

export const countFn: ActFn = async (body) => {
	const {
		set: { status, categoryId },
		get,
	} = body.details;

	const filters: Document = {};

	status && (filters["status"] = status);
	categoryId && (filters["category._id"] = categoryId);

	const foundedItemsLength = await report.countDocument({
		filter: filters,
	});

	return { qty: foundedItemsLength };
};
