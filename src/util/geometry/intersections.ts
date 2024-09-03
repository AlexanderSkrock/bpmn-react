import Rectangle from "./Rectangle";
import Line from "./Line";

import { slope } from "./lines";

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
        || intersectsLineLine(line, new Line(rectangle.upperRight(), rectangle.bottomLeft()))
        || intersectsLineLine(line, new Line(rectangle.bottomLeft(), rectangle.bottomRight()))
        || intersectsLineLine(line, new Line(rectangle.bottomRight(), rectangle.upperLeft()));
}

export const intersectsLineLine = (line1: Line, line2: Line): boolean => {
    const slope1 = slope(line1);
    const slope2 = slope(line2);

    const off1 = line1.point1.y - (slope1 * line1.point1.x);
    const off2 = line2.point1.y - (slope2 * line2.point1.x);

    const intersectionX = (off1 - off2) / (slope2 - slope1)
    const intersectionY = slope1 * intersectionX + off1;

    return intersectionX >= Math.min(line1.point1.x, line1.point2.x) && intersectionX <= Math.max(line1.point1.x, line1.point2.x)
        && intersectionY >= Math.min(line1.point1.y, line1.point2.y) && intersectionX <= Math.max(line1.point1.y, line1.point2.y)
}
