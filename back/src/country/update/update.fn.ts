import { type ActFn, type Infer, object, ObjectId } from "lesan";
import { country } from "../../../mod.ts";
import { country_pure } from "@model";

export const updateFn: ActFn = async (body) => {
	const {
		set: {
			_id,
			name,
			english_name,
			area,
			center,
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

	name && (updateObj.name = name);
	english_name && (updateObj.english_name = english_name);
	area && (updateObj.area = area);
	center && (updateObj.center = center);
	wars_history && (updateObj.wars_history = wars_history);
	conflict_timeline && (updateObj.conflict_timeline = conflict_timeline);
	casualties_info && (updateObj.casualties_info = casualties_info);
	international_response && (updateObj.international_response = international_response);
	war_crimes_documentation && (updateObj.war_crimes_documentation = war_crimes_documentation);
	human_rights_violations && (updateObj.human_rights_violations = human_rights_violations);
	genocide_info && (updateObj.genocide_info = genocide_info);
	chemical_weapons_info && (updateObj.chemical_weapons_info = chemical_weapons_info);
	displacement_info && (updateObj.displacement_info = displacement_info);
	reconstruction_status && (updateObj.reconstruction_status = reconstruction_status);
	international_sanctions && (updateObj.international_sanctions = international_sanctions);
	notable_war_events && (updateObj.notable_war_events = notable_war_events);

	return await country.findOneAndUpdate({
		filter: { _id: new ObjectId(_id as string) },
		update: {
			$set: updateObj,
		},
		projection: get,
	});
};
