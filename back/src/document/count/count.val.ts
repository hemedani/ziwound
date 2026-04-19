import { object, optional, string } from "lesan";

export const countValidator = () => {
  return object({
    set: object({
      search: optional(string()),
    }),
    get: object({ qty: optional(string()) }),
  });
};
