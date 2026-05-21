import { type ActFn, ObjectId, type TInsertRelations } from "lesan";
import { user } from "../../../mod.ts";
import type { user_relations } from "@model";
import { hash } from "@da/bcrypt";

export const addUserFn: ActFn = async (body) => {
	const { set, get } = body.details;

  const { nationalCard, avatar, provinceId, cityId, countryId, password, ...rest } = set;

  const relations: TInsertRelations<typeof user_relations> = {};

  nationalCard &&
    (relations.national_card = {
      _ids: new ObjectId(nationalCard as string),
    });

  avatar &&
    (relations.avatar = {
      _ids: new ObjectId(avatar as string),
    });

  provinceId &&
    (relations.province = {
      _ids: [new ObjectId(provinceId as string)],
      relatedRelations: {
        users: true,
      },
    });

  cityId &&
    (relations.city = {
      _ids: [new ObjectId(cityId as string)],
      relatedRelations: {
        users: true,
      },
    });

  countryId &&
    (relations.country = {
      _ids: [new ObjectId(countryId as string)],
      relatedRelations: {
        users: true,
      },
    });

	const addedUser = await user.insertOne({
		doc: {
			...rest,
			password: password ? await hash(password as string) : undefined,
			birth_date: rest.birth_date ? new Date(rest.birth_date as string) : undefined,
		},
		relations,
		projection: get,
	});

	return addedUser;
};
