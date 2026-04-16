import { grantAccess, setTokens, setUser } from "@lib";
import { coreApp, rateLimiter } from "../../../mod.ts";
import { createRateLimitMiddleware } from "../../../utils/rateLimiter.ts";
import { addFn } from "./add.fn.ts";
import { addValidator } from "./add.val.ts";

export const addSetup = () => {
	const rateLimitMiddleware = createRateLimitMiddleware(rateLimiter);
	return coreApp.acts.setAct({
		schema: "report",
		fn: addFn,
		actName: "add",
		preAct: [
			rateLimitMiddleware,
			setTokens,
			setUser,
			grantAccess({
				levels: ["Manager", "Editor", "Ordinary"],
			}),
		],
		validator: addValidator(),
		validationRunType: "create",
	});
};
