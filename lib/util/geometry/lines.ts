import Line from "./Line";

export const isVertical = (line: Line): boolean => {
    return line.point1.x === line.point2.x;
}

export const slope = (line: Line): number => {
    return (line.point2.y - line.point1.y) / (line.point2.x - line.point1.x);
}

export const areCollinear = (line1: Line, line2: Line) => {
    return slope(line1) === slope(line2)
}

export const overlap = (line1: Line, line2: Line) => {
    return Math.max(line1.point1.x, line1.point2.x) >= Math.min(line2.point1.x, line2.point2.x)
        && Math.min(line1.point1.x, line1.point2.x) <= Math.max(line2.point1.x, line2.point2.x)
        && Math.max(line1.point1.y, line1.point2.y) >= Math.min(line2.point1.y, line2.point2.y)
        && Math.min(line1.point1.y, line1.point2.y) <= Math.max(line2.point1.y, line2.point2.y);
}
