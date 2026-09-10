import { type ActFn, ObjectId } from "lesan";
import { coreApp, regionalManagerRequest } from "../../../mod.ts";
import { throwError } from "@lib";
import type { MyContext } from "@lib";

export const addFn: ActFn = async (body) => {
  const {
    set: { areaType, countryId, provinceId, cityId, justification },
    get,
  } = body.details;
  const { user }: MyContext = coreApp.contextFns
    .getContextModel() as unknown as MyContext;

  const areaIds: Record<string, unknown> = {
    Country: countryId,
    Province: provinceId,
    City: cityId,
  };

  if (!areaIds[areaType]) {
    throwError("Area is required for the selected area type");
  }

  if ([countryId, provinceId, cityId].filter(Boolean).length !== 1) {
    throwError("Select exactly one area for your request");
  }

  const existingRequest = await regionalManagerRequest.findOne({
    filters: {
      "user._id": user._id,
      status: { $ne: "Rejected" },
    },
  });

  if (existingRequest) {
    throwError("You already have an active or pending request");
  }

  const relations: Record<string, unknown> = {
    user: {
      _ids: user._id,
      relatedRelations: {
        regionalManagerRequests: true,
      },
    },
  };

  if (areaType === "Country") {
    relations.country = { _ids: new ObjectId(countryId) };
  } else if (areaType === "Province") {
    relations.province = { _ids: new ObjectId(provinceId) };
  } else {
    relations.city = { _ids: new ObjectId(cityId) };
  }

  return await regionalManagerRequest.insertOne({
    doc: {
      areaType,
      justification,
      status: "Pending",
    },
    relations: relations as never,
    projection: get,
  });
};
