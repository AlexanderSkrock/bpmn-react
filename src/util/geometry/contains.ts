import Rectangle from "./Rectangle";
import {Geometry} from "./geometry.types";
import Point from "./Point";
import Line from "./Line";
import {intersectsRectangleLine} from "./intersections";

export const contains = (rectangle: Rectangle, geometry: Geometry): boolean => {
    if (geometry instanceof Point) {
        return containsPoint(rectangle, geometry);
    } else if (geometry instanceof Line) {
        return containsLine(rectangle, geometry);
    } else {
        throw new Error(`unsupported geometry type: ${typeof geometry}`);
    }
}

export const containsPoint = (rectangle: Rectangle, point: Point): boolean => {
    return point.x >= rectangle.x
        && point.x <= rectangle.x + rectangle.width
        && point.y >= rectangle.y
        && point.y <= rectangle.y + rectangle.height;
}

export const containsLine = (rectangle: Rectangle, line: Line): boolean => {
    if (containsPoint(rectangle, line.point1) || containsPoint(rectangle, line.point2)) {
        return true;
    }

    return intersectsRectangleLine(rectangle, line);
}
