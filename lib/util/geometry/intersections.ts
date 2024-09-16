import Rectangle from "./Rectangle";
import Line from "./Line";

import {areCollinear, isVertical, overlap, slope} from "./lines";
import Point from "./Point";

export const intersectsRectangleRectangle = (rectangle1: Rectangle, rectangle2: Rectangle): boolean => {
    return !(
        rectangle1.x > rectangle2.x + rectangle2.width
        || rectangle1.x + rectangle1.width < rectangle2.x
        || rectangle1.y > rectangle2.y + rectangle2.height
        || rectangle1.y + rectangle1.height < rectangle2.y
    );
}

export const intersectsRectangleLine = (rectangle: Rectangle, line: Line): boolean => {
    return intersectsLineLine(line, new Line(rectangle.upperLeft(), rectangle.upperRight()))
        || intersectsLineLine(line, new Line(rectangle.upperRight(), rectangle.bottomRight()))
        || intersectsLineLine(line, new Line(rectangle.bottomRight(), rectangle.bottomLeft()))
        || intersectsLineLine(line, new Line(rectangle.bottomLeft(), rectangle.upperLeft()));
}

export const intersectsLineLine = (line1: Line, line2: Line): boolean => {
    if (areCollinear(line1, line2)) {
        return overlap(line1, line2);
    }

    let intersection;
    if (isVertical(line1)) {
        const slope2 = slope(line2);
        const intersectionX = line1.point1.x;
        intersection = new Point(intersectionX, slope2 * intersectionX + (line2.point1.y - slope2 * line2.point1.x));
    } else if(isVertical(line2)) {
        const slope1 = slope(line1);
        const intersectionX = line2.point1.x;
        intersection = new Point(intersectionX, slope1 * intersectionX + (line1.point1.y - slope1 * line1.point1.x));
    } else {
        const slope1 = slope(line1);
        const slope2 = slope(line2);
        const off1 = line1.point1.y - (slope1 * line1.point1.x);
        const off2 = line2.point1.y - (slope2 * line2.point1.x);

        const intersectionX = (off1 - off2) / (slope2 - slope1)
        const intersectionY = slope1 * intersectionX + off1;
        intersection = new Point(intersectionX, intersectionY);
    }

    return intersectsPointLine(intersection, line1) && intersectsPointLine(intersection, line2)
}

export const intersectsPointLine = (point: Point, line: Line) => {
    return point.x >= Math.min(line.point1.x, line.point2.x)
        && point.x <= Math.max(line.point1.x, line.point2.x)
        && point.y >= Math.min(line.point1.y, line.point2.y)
        && point.y <= Math.max(line.point1.y, line.point2.y);
}
