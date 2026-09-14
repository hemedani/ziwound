import type { ActFn, Document } from "lesan";
import { escapeRegex } from "@lib";
import { province } from "../../../mod.ts";

export const countFn: ActFn = async (body) => {
	const {
		set: { name },
		get,
	} = body.details;

	const filters: Document = {};

	// Match the native name OR the English name (mirrors province.gets).
	if (name) {
		const nameRegex = new RegExp(escapeRegex(name), "i");
		filters["$or"] = [
			{ name: { $regex: nameRegex } },
			{ english_name: { $regex: nameRegex } },
		];
	}

	const foundedItemsLength = await province.countDocument({
		filter: filters,
	});

	return { qty: foundedItemsLength };
};
