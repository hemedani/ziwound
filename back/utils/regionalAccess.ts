import { ObjectId } from "lesan";
import { city, province, report, user } from "../mod.ts";
import { throwError } from "./throwError.ts";

export type ManagedArea = {
  countryId?: string;
  provinceId?: string;
  cityId?: string;
  isRegionalManager: boolean;
};

export type AreaScope = {
  countryIds: string[];
  provinceIds: string[];
  cityIds: string[];
};

export const isAdminLevel = (user: { level?: string }) =>
  user.level === "Ghost" || user.level === "Manager" || user.level === "Editor";

export const getManagedAreaOfUser = async (
  userId: string | ObjectId,
): Promise<ManagedArea> => {
  const foundedUser = await user.findOne({
    filters: { _id: new ObjectId(userId) },
    projection: {
      isRegionalManager: 1,
      managesCountry: 1,
      managesProvince: 1,
      managesCity: 1,
    },
  });

  if (!foundedUser) return throwError("user not exist");

  return {
    countryId: foundedUser.managesCountry?._id?.toString(),
    provinceId: foundedUser.managesProvince?._id?.toString(),
    cityId: foundedUser.managesCity?._id?.toString(),
    isRegionalManager: foundedUser.isRegionalManager || false,
  };
};

/**
 * Resolves the downward-closed set of report "attacked" area ids that a
 * regional manager is allowed to manage. A country manager inherits its
 * provinces and cities; a province manager inherits its cities; a city
 * manager only manages the city itself.
 */
export const getReportAreaScope = async (
  userId: string | ObjectId,
): Promise<AreaScope> => {
  const area = await getManagedAreaOfUser(userId);

  const countryIds: string[] = [];
  const provinceIds: string[] = [];
  const cityIds: string[] = [];

  if (area.countryId) {
    countryIds.push(area.countryId);

    const foundProvinces = await province.find({
      filters: { "country._id": new ObjectId(area.countryId) },
      projection: { _id: 1 },
    }).toArray();
    provinceIds.push(...foundProvinces.map((p) =>
      (p as { _id: ObjectId })._id.toString()
    ));

    const foundCities = await city.find({
      filters: { "country._id": new ObjectId(area.countryId) },
      projection: { _id: 1 },
    }).toArray();
    cityIds.push(...foundCities.map((c) =>
      (c as { _id: ObjectId })._id.toString()
    ));
  }

  if (area.provinceId) {
    provinceIds.push(area.provinceId);

    const foundCities = await city.find({
      filters: { "province._id": new ObjectId(area.provinceId) },
      projection: { _id: 1 },
    }).toArray();
    cityIds.push(...foundCities.map((c) =>
      (c as { _id: ObjectId })._id.toString()
    ));
  }

  if (area.cityId) {
    cityIds.push(area.cityId);
  }

  return { countryIds, provinceIds, cityIds };
};

/**
 * Throws unless the user is an admin (Ghost/Manager/Editor) or is a regional
 * manager whose managed area of the given type equals the target id.
 */
export const assertAreaAccess = async (
  user: { _id: string | ObjectId; level?: string },
  areaType: "Country" | "Province" | "City",
  targetId: string,
) => {
  if (isAdminLevel(user)) return;

  const area = await getManagedAreaOfUser(user._id);
  if (!area.isRegionalManager) {
    throwError("You don't have regional manager access");
  }

  const matches =
    (areaType === "Country" && area.countryId === targetId) ||
    (areaType === "Province" && area.provinceId === targetId) ||
    (areaType === "City" && area.cityId === targetId);

  if (!matches) {
    throwError("You can only manage your own area");
  }
};

/**
 * Throws unless the user is an admin or the report belongs to the user's
 * managed area (checked against its attacked countries/provinces/cities).
 */
export const assertReportInArea = async (
  user: { _id: string | ObjectId; level?: string },
  reportId: string,
) => {
  if (isAdminLevel(user)) return;

  const area = await getManagedAreaOfUser(user._id);
  if (!area.isRegionalManager) {
    throwError("You don't have regional manager access");
  }

  const foundedReport = await report.findOne({
    filters: { _id: new ObjectId(reportId) },
    projection: {
      attackedCountries: 1,
      attackedProvinces: 1,
      attackedCities: 1,
    },
  });

  if (!foundedReport) return throwError("report not found");

  const idsOf = (arr?: { _id: ObjectId }[]) =>
    (arr || []).map((item) => item._id.toString());

  const scope = await getReportAreaScope(user._id);

  const inCountry = idsOf(foundedReport.attackedCountries).some((id) =>
    scope.countryIds.includes(id)
  );
  const inProvince = idsOf(foundedReport.attackedProvinces).some((id) =>
    scope.provinceIds.includes(id)
  );
  const inCity = idsOf(foundedReport.attackedCities).some((id) =>
    scope.cityIds.includes(id)
  );

  if (!inCountry && !inProvince && !inCity) {
    throwError("This report is not in your managed area");
  }
};
