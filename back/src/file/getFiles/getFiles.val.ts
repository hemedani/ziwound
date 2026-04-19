import { enums, number, object, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const getFilesValidator = () => {
	return object({
		set: object({
			page: number(),
			limit: number(),
			name: optional(string()),
			type: optional(enums(["image", "video", "doc"])),
		}),
		get: selectStruct("file", 2),
	});
};
