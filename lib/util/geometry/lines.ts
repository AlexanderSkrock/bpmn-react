import Line from "./Line";

export const slope = (line: Line): number => {
    return (line.point2.y - line.point1.y) / (line.point2.x - line.point1.x);
}
