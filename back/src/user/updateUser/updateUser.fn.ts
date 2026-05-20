import { type ActFn, Infer, object, ObjectId } from "lesan";
import { user } from "../../../mod.ts";
import { user_pure } from "../../../models/user.ts";

export const updateUserFn: ActFn = async (body) => {
	const {
		set: {
			_id,
			first_name,
			last_name,
			gender,
			birth_date,
			summary,
			address,
			level,
			email,
			password,
			is_verified,
			bio,
			expertise,
			verified,
			verificationBadge,
			isPublic,
		},
		get,
	} = body.details;

	const pureStruct = object(user_pure);
	const updateObj: Partial<Infer<typeof pureStruct>> = {
		updatedAt: new Date(),
		...(first_name !== undefined && { first_name }),
		...(last_name !== undefined && { last_name }),
		...(gender !== undefined && { gender }),
		...(birth_date !== undefined && { birth_date: new Date(birth_date as string) }),
		...(summary !== undefined && { summary }),
		...(address !== undefined && { address }),
		...(level !== undefined && { level }),
		...(email !== undefined && { email }),
		...(password !== undefined && { password }),
		...(is_verified !== undefined && { is_verified }),
		...(bio !== undefined && { bio }),
		...(expertise !== undefined && { expertise }),
		...(verified !== undefined && { verified }),
		...(verificationBadge !== undefined && { verificationBadge }),
		...(isPublic !== undefined && { isPublic }),
	};

	return await user.findOneAndUpdate({
		filter: { _id: new ObjectId(_id as string) },
		update: {
			$set: updateObj,
		},
		projection: get,
	});
};
