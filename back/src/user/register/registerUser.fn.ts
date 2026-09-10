import { type ActFn, ObjectId } from "lesan";
import { regionalManagerRequest, user } from "../../../mod.ts";
import { throwError } from "@lib";
import { hash } from "@da/bcrypt";

export const registerUserFn: ActFn = async (body) => {
	const {
		set: {
			first_name,
			last_name,
			father_name,
			gender,
			birth_date,
			summary,
			address,
			email,
			password,
			bio,
			expertise,
			avatarId,
			regionalAreaType,
			regionalCountryId,
			regionalProvinceId,
			regionalCityId,
			regionalJustification,
		},
		get,
	} = body.details;

	const foundedUserWithEmail = await user.findOne({
		filters: { email },
	});

	if (foundedUserWithEmail) {
		return throwError("این کاربر قبلا ثبت  نام کرده است");
	}

	const relations: Record<string, unknown> = {};
	if (avatarId) {
		relations.avatar = { _ids: new ObjectId(avatarId) };
	}

	const registeredUser = await user.insertOne({
		doc: {
			first_name,
			last_name,
			father_name,
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
			isRegionalManager: false,
		},
		projection: get,
		relations: Object.keys(relations).length > 0
			? relations as never
			: undefined,
	});

	if (!registeredUser) {
		return throwError("کاربر ایجاد نشد");
	}

	if (regionalAreaType) {
		const areaIds: Record<string, unknown> = {
			Country: regionalCountryId,
			Province: regionalProvinceId,
			City: regionalCityId,
		};

		if (!areaIds[regionalAreaType]) {
			throwError("Area is required for the selected area type");
		}

		if (
			[regionalCountryId, regionalProvinceId, regionalCityId]
				.filter(Boolean).length !== 1
		) {
			throwError("Select exactly one area for your request");
		}

		const requestRelations: Record<string, unknown> = {
			user: {
				_ids: registeredUser._id,
				relatedRelations: {
					regionalManagerRequests: true,
				},
			},
		};

		if (regionalAreaType === "Country") {
			requestRelations.country = {
				_ids: new ObjectId(regionalCountryId),
			};
		} else if (regionalAreaType === "Province") {
			requestRelations.province = {
				_ids: new ObjectId(regionalProvinceId),
			};
		} else {
			requestRelations.city = { _ids: new ObjectId(regionalCityId) };
		}

		await regionalManagerRequest.insertOne({
			doc: {
				areaType: regionalAreaType,
				justification: regionalJustification,
				status: "Pending",
			},
			relations: requestRelations as never,
			projection: { _id: 1 },
		});
	}

	return registeredUser;
};
