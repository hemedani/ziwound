import { object } from "lesan";
import { language_enums } from "@model";

/**
 * The landing payload has a fixed shape, so the client does not choose a
 * projection — `get` exists only to satisfy the act contract.
 */
export const landingPageValidator = () => {
  return object({
    set: object({
      locale: language_enums,
    }),
    get: object({}),
  });
};
