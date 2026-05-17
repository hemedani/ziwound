import type { ActFn } from "lesan";
import { heroSlide } from "../../../mod.ts";

export const countFn: ActFn = async (body) => {
  const { isActive, selected_language } = body.details.set;

  const filter: Record<string, unknown> = {};

  if (isActive !== undefined) {
    filter.isActive = isActive === "true" || isActive === true;
  }

  if (selected_language) {
    filter.selected_language = selected_language;
  }

  return await heroSlide.countDocument({ filter });
};
