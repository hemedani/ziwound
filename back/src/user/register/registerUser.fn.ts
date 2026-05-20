import type { ActFn } from "lesan";
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
			gender,
			birth_date,
			summary,
			address,
			bio,
			expertise,
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
			gender,
			birth_date: birth_date ? new Date(birth_date as string) : undefined,
			summary,
			address,
			bio,
			expertise,
			level: "Ordinary",
			is_verified: false,
			verified: false,
			isPublic: true,
		},
		projection: get,
	});

	return registeredUser ? registeredUser : throwError("کاربر ایجاد نشد");
};
