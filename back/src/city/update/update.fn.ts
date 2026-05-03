import { type ActFn, type Infer, object, ObjectId } from "lesan";
import { city } from "../../../mod.ts";
import { city_pure } from "@model";

export const updateFn: ActFn = async (body) => {
	const {
		set: {
			_id,
			name,
			area,
			english_name,
			center,
			wars_history,
			conflict_timeline,
			casualties_info,
			notable_battles,
			occupation_info,
			destruction_level,
			civilian_impact,
			mass_graves_info,
			war_crimes_events,
			liberation_info,
		},
		get,
	} = body.details;

	const pureStruct = object(city_pure);
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
	notable_battles && (updateObj.notable_battles = notable_battles);
	occupation_info && (updateObj.occupation_info = occupation_info);
	destruction_level && (updateObj.destruction_level = destruction_level);
	civilian_impact && (updateObj.civilian_impact = civilian_impact);
	mass_graves_info && (updateObj.mass_graves_info = mass_graves_info);
	war_crimes_events && (updateObj.war_crimes_events = war_crimes_events);
	liberation_info && (updateObj.liberation_info = liberation_info);

	return await city.findOneAndUpdate({
		filter: { _id: new ObjectId(_id as string) },
		update: {
			$set: updateObj,
		},
		projection: get,
	});
};
