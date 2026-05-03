import { grantAccess, setTokens, setUser } from "@lib";
import { coreApp } from "../../../mod.ts";
import { getsFn } from "./gets.fn.ts";
import { getsValidator } from "./gets.val.ts";

export const getsSetup = () =>
	coreApp.acts.setAct({
		schema: "country",
		fn: getsFn,
		actName: "gets",
		preAct: [
			setTokens,
			setUser,
			grantAccess({
				levels: ["Ghost", "Manager", "Editor", "Ordinary"],
			}),
		],
		validator: getsValidator(),
	});
