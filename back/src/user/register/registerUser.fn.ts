import type { ActFn } from "@deps";
import { user } from "../../../mod.ts";
import { throwError } from "@lib";
import { hash } from "@da/bcrypt";

export const registerUserFn: ActFn = async (body) => {
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

	const foundedUserWithEmail = await user.findOne({
		filters: { email },
	});

	if (foundedUserWithEmail) {
		return throwError("این کاربر قبلا ثبت  نام کرده است");
	}

	const registeredUser = await user.insertOne({
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
			level: "Ordinary",
			is_verified: false,
			createdAt,
			updatedAt,
		},
		projection: get,
	});

	return registeredUser ? registeredUser : throwError("کاربر ایجاد نشد");
};
