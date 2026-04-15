import { coreApp } from "../../../mod.ts";
import { getFn } from "./get.fn.ts";
import { getValidator } from "./get.val.ts";
import { grantAccess, setTokens, setUser } from "@lib";

export const getSetup = () =>
	coreApp.acts.setAct({
		schema: "file",
		fn: getFn,
		actName: "get",
		preAct: [
			setTokens,
			setUser,
			grantAccess({
				levels: ["Manager", "Editor", "Ordinary"],
			}),
		],
		validator: getValidator(),
	});
