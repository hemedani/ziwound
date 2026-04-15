import { type ActFn, type Infer, object, ObjectId } from "@deps";
import { report } from "../../../mod.ts";
import { report_pure } from "@model";

export const updateFn: ActFn = async (body) => {
	const {
		set: { _id, ...rest },
		get,
	} = body.details;

	const pureStruct = object(report_pure);
	const updateObj: Partial<Infer<typeof pureStruct>> = {
		updatedAt: new Date(),
	};

	rest.title && (updateObj.title = rest.title);
	rest.description && (updateObj.description = rest.description);
	rest.address && (updateObj.address = rest.address);
	rest.status && (updateObj.status = rest.status);
	rest.priority && (updateObj.priority = rest.priority);
	rest.location && (updateObj.location = rest.location);

	return await report.findOneAndUpdate({
		filter: { _id: new ObjectId(_id as string) },
		update: {
			$set: updateObj,
		},
		projection: get,
	});
};
