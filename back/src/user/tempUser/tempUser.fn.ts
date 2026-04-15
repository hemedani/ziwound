import type { ActFn } from "@deps";
import { user } from "../../../mod.ts";
import { throwError } from "@lib";
import { hash } from "@da/bcrypt";

export const tempUserFn: ActFn = async (body) => {
	const {
		set: {
			first_name,
			last_name,
			email,
			password,
			father_name,
			gender,
			birth_date,
			summary,
			address,
			createdAt,
			updatedAt,
		},
		get,
	} = body.details;

	const foundedUser = await user.find({ filters: {} }).limit(1).toArray();

	if (foundedUser.length > 0) {
		return throwError("Can not do this Action!!");
	}

	return await user.insertOne({
		doc: {
			first_name,
			last_name,
			email,
			password: await hash(password),
			father_name,
			gender,
			birth_date,
			summary,
			address,
			level: "Ghost",
			createdAt,
			updatedAt,
		},
		projection: get,
	});
};
