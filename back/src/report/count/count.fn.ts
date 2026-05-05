import type { ActFn, Document } from "lesan";
import { ObjectId } from "lesan";
import { report } from "../../../mod.ts";

export const countFn: ActFn = async (body) => {
  const {
    set: {
      status,
      priority,
      selected_language,
      categoryId,
      hostileCountryIds,
      attackedCountryIds,
      attackedProvinceIds,
      attackedCityIds,
      createdAtFrom,
      createdAtTo,
    },
    get,
  } = body.details;

  const filters: Document = {};

  status && (filters["status"] = status);
  priority && (filters["priority"] = priority);
  selected_language && (filters["selected_language"] = selected_language);
  categoryId && (filters["category._id"] = new ObjectId(categoryId));

  hostileCountryIds && hostileCountryIds.length > 0 &&
    (filters["hostileCountries._id"] = {
      $in: hostileCountryIds.map((id: string) => new ObjectId(id)),
    });

  attackedCountryIds && attackedCountryIds.length > 0 &&
    (filters["attackedCountries._id"] = {
      $in: attackedCountryIds.map((id: string) => new ObjectId(id)),
    });

  attackedProvinceIds && attackedProvinceIds.length > 0 &&
    (filters["attackedProvinces._id"] = {
      $in: attackedProvinceIds.map((id: string) => new ObjectId(id)),
    });

  attackedCityIds && attackedCityIds.length > 0 &&
    (filters["attackedCities._id"] = {
      $in: attackedCityIds.map((id: string) => new ObjectId(id)),
    });

  createdAtFrom && (filters["createdAt"] = { $gte: createdAtFrom });
  createdAtTo &&
    (filters["createdAt"] = {
      ...filters["createdAt"] as object,
      $lte: createdAtTo,
    });

  const foundedItemsLength = await report.countDocument({
    filter: filters,
  });

  return { qty: foundedItemsLength };
};
