import { type ActFn, ObjectId, type TInsertRelations } from "@deps";
import { user } from "../../../mod.ts";
import type { user_relations } from "@model";

export const updateUserRelationsFn: ActFn = async (body) => {
	const {
		set: { _id, avatar, national_card, province, city },
		get,
	} = body.details;

	const relations: TInsertRelations<typeof user_relations> = {};

	avatar &&
		(relations.avatar = {
			_ids: new ObjectId(avatar as string),
			relatedRelations: {},
		});

	national_card &&
		(relations.national_card = {
			_ids: new ObjectId(national_card as string),
			relatedRelations: {},
		});

	province &&
		(relations.province = {
			_ids: [new ObjectId(province as string)],
			relatedRelations: {
				users: true,
			},
		});

	city &&
		(relations.city = {
			_ids: [new ObjectId(city as string)],
			relatedRelations: {
				users: true,
			},
		});

	return await user.addRelation({
		filters: { _id: new ObjectId(_id as string) },
		relations,
		projection: get,
		replace: true,
	});
};
