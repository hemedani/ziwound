import type { ActFn } from "@deps";
import { category, city, province, tag, user } from "../../../mod.ts";

export const dashboardStatisticFn: ActFn = async () => {
  const categories = await category.countDocument({});
  const cities = await city.countDocument({});
  const provinces = await province.countDocument({});
  const tags = await tag.countDocument({});
  const users = await user.countDocument({});

  return {
    categories,
    cities,
    provinces,
    tags,
    users,
  };
};
