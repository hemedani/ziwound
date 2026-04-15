import { array, literal, number, object, tuple } from "@deps";

const Coordinate = tuple([number(), number()]);
export type GeoJSONGeometryType =
	| "Point"
	| "LineString"
	| "Polygon"
	| "MultiPoint"
	| "MultiLineString"
	| "MultiPolygon";

const getCoordinatesSchema = (type: GeoJSONGeometryType) => {
	switch (type) {
		case "Point":
			return Coordinate;
		case "LineString":
		case "MultiPoint":
			return array(Coordinate);
		case "Polygon":
		case "MultiLineString":
			return array(array(Coordinate));
		case "MultiPolygon":
			return array(array(array(Coordinate)));
		default:
			return Coordinate; // Fallback for other types
	}
};

export const geoJSONStruct = (
	type: GeoJSONGeometryType,
) => object({
	type: literal(type),
	coordinates: getCoordinatesSchema(type),
});
