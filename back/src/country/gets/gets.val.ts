import { number, object, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const getsValidator = () => {
	return object({
		set: object({
			page: number(),
			limit: number(),
			name: optional(string()),
			search: optional(string()),
		}),
		get: selectStruct("country", 2),
	});
};
