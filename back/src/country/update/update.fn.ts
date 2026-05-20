import { type ActFn, type Infer, object, ObjectId } from "lesan";
import { country } from "../../../mod.ts";
import { country_pure } from "@model";

export const updateFn: ActFn = async (body) => {
	const {
		set: {
			_id,
			name,
			english_name,
			wars_history,
			conflict_timeline,
			casualties_info,
			international_response,
			war_crimes_documentation,
			human_rights_violations,
			genocide_info,
			chemical_weapons_info,
			displacement_info,
			reconstruction_status,
			international_sanctions,
			notable_war_events,
		},
		get,
	} = body.details;

	const pureStruct = object(country_pure);
	const updateObj: Partial<Infer<typeof pureStruct>> = {
		updatedAt: new Date(),
	};

	name !== undefined && (updateObj.name = name);
	english_name !== undefined && (updateObj.english_name = english_name);
	wars_history !== undefined && (updateObj.wars_history = wars_history);
	conflict_timeline !== undefined && (updateObj.conflict_timeline = conflict_timeline);
	casualties_info !== undefined && (updateObj.casualties_info = casualties_info);
	international_response !== undefined && (updateObj.international_response = international_response);
	war_crimes_documentation !== undefined && (updateObj.war_crimes_documentation = war_crimes_documentation);
	human_rights_violations !== undefined && (updateObj.human_rights_violations = human_rights_violations);
	genocide_info !== undefined && (updateObj.genocide_info = genocide_info);
	chemical_weapons_info !== undefined && (updateObj.chemical_weapons_info = chemical_weapons_info);
	displacement_info !== undefined && (updateObj.displacement_info = displacement_info);
	reconstruction_status !== undefined && (updateObj.reconstruction_status = reconstruction_status);
	international_sanctions !== undefined && (updateObj.international_sanctions = international_sanctions);
	notable_war_events !== undefined && (updateObj.notable_war_events = notable_war_events);

	return await country.findOneAndUpdate({
		filter: { _id: new ObjectId(_id as string) },
		update: {
			$set: updateObj,
		},
		projection: get,
	});
};
