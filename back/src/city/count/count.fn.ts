import type { ActFn, Document } from "lesan";
import { escapeRegex } from "@lib";
import { city, coreApp } from "../../../mod.ts";

export const countFn: ActFn = async (body) => {
	const {
		set: { name },
		get,
	} = body.details;

	// `city` now holds ~153k rows. Lesan's `countDocument` maps straight onto
	// MongoDB's `countDocuments`, which is an aggregation scan — on the
	// production host that takes ~45s, and both the public explore page and the
	// admin cities list await this count, so the whole page hangs.
	//
	// With no filter we only need the total, and the collection metadata gives
	// that in O(1). It is exact after any write and can only drift after an
	// unclean shutdown, which is fine for a displayed total.
	if (!name) {
		const collection = coreApp.odm.getCollection("city");
		return { qty: await collection.estimatedDocumentCount() };
	}

	// Escape the term: names such as "Cocos (Keeling) Islands" would otherwise
	// build an invalid regex and throw.
	const filters: Document = {
		name: { $regex: new RegExp(escapeRegex(name), "i") },
	};

	const foundedItemsLength = await city.countDocument({
		filter: filters,
	});

	return { qty: foundedItemsLength };
};
