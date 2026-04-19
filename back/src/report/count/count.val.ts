import { enums, object, optional, string } from "lesan";
import { report_status_array } from "@model";

export const countValidator = () => {
	return object({
		set: object({
			status: optional(enums(report_status_array)),
			categoryId: optional(string()),
		}),
		get: object({ qty: optional(enums([0, 1])) }),
	});
};
