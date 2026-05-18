import { enums, number, object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { pagination } from "@lib";

export const getsValidator = () => {
	return object({
		set: object({
			...pagination,
			// Text search
			search: optional(string()),
			// File type filter
			type: optional(enums(["image", "video", "docs"])),
			// MIME type filter (e.g., "image/png", "application/pdf")
			mimeType: optional(string()),
			// Uploader filter
			uploaderId: optional(objectIdValidation),
			// Size range filters (in bytes)
			minSize: optional(number()),
			maxSize: optional(number()),
			// Sort options
			sortBy: optional(enums(["createdAt", "updatedAt", "name", "size"])),
			sortOrder: optional(enums(["asc", "desc"])),
		}),
		get: selectStruct("file", 2),
	});
};
