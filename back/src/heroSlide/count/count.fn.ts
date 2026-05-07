import type { ActFn } from "lesan";
import { heroSlide } from "../../../mod.ts";

export const countFn: ActFn = async (body) => {
  const { isActive } = body.details.set;

  const filter: Record<string, unknown> = {};

  if (isActive !== undefined) {
    filter.isActive = isActive === "true" || isActive === true;
  }

  return await heroSlide.countDocument({ filter });
};
