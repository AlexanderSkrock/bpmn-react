import {Geometry} from "./geometry.types";
import Point from "./Point";
import Line from "./Line";

export const distance = (geometry1: Geometry, geometry2: Geometry): number => {
    if (geometry1 instanceof Point) {
        if (geometry2 instanceof Point) {
            return distancePointPoint(geometry1, geometry2);
        } else if (geometry2 instanceof Line){
            return distancePointLine(geometry1, geometry2);
        }
    } else if (geometry1 instanceof Line) {
        if (geometry2 instanceof Point) {
            return distancePointLine(geometry2, geometry1);
        }
    }
    throw new Error(`unsupported geometries '${typeof geometry1}' and '${typeof geometry2}'`);
}

export const distancePointPoint = (point1: Point, point2: Point) => {
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}

export const distancePointLine = (point: Point, line: Line): number => {
    const segmentLength = Math.sqrt((line.point2.x - line.point1.x) ** 2 + (line.point2.y - line.point1.y) ** 2);
    const dotProduct = (point.x - line.point1.x) * (line.point2.x - line.point1.x) + (point.y - line.point1.y) * (line.point2.y - line.point1.y);
    const t = Math.max(0, Math.min(1, dotProduct / (segmentLength * segmentLength)));

    const closestPointX = line.point1.x + t * (line.point2.x - line.point1.x);
    const closestPointY = line.point1.y + t * (line.point2.y - line.point1.y);

    return Math.sqrt((point.x - closestPointX) ** 2 + (point.y - closestPointY) ** 2);
}
