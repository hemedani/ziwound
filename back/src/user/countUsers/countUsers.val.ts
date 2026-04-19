import { array, enums, object, optional } from "lesan";
import { user_level_emums } from "@model";

export const countUsersValidator = () => {
	return object({
		set: object({
			levels: optional(array(user_level_emums)),
		}),
		get: object({
			qty: enums([0, 1]),
		}),
	});
};
