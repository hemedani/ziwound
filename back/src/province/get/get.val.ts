import { object, objectIdValidation, string } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const getValidator = () => {
	return object({
		set: object({
			_id: objectIdValidation,
		}),
		get: selectStruct("province", 2),
	});
};
