import { enums, object, optional, string } from "lesan";

export const countValidator = () => {
	return object({
		set: object({
			name: optional(string()),
		}),
		get: object({ qty: optional(enums([0, 1])) }),
	});
};
