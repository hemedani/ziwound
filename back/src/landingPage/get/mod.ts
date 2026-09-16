import { coreApp } from "../../../mod.ts";
import { landingPageFn } from "./get.fn.ts";
import { landingPageValidator } from "./get.val.ts";

/**
 * Registered on the `heroSlide` schema because Lesan attaches every act to a
 * schema, and hero slides are the only model whose content is exclusively part
 * of the landing page. The act itself aggregates several models.
 */
export const getSetup = () =>
  coreApp.acts.setAct({
    schema: "heroSlide",
    fn: landingPageFn,
    actName: "landingPage",
    validator: landingPageValidator(),
  });
