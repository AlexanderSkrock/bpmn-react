import type { ElementLike } from "diagram-js/lib/model/Types";

import {
    distancePointLine,
    distancePointPoint,
    Line,
    Point,
    Rectangle
} from "../../util/geometry";

export function getDistance(point: Point, element: ElementLike): number {
    const isLineElement = !element.width || !element.height
    if (isLineElement) {
        const lines: [Point, Point][] = [];
        if (element.waypoints) {
            for (let i = 0; i < element.waypoints.length - 1; i++) {
                lines.push([element.waypoints[i], element.waypoints[i + 1]]);
            }
        }
        return pointLinesDistance(point, lines);
    } else {
        const elementRectangle = new Rectangle(element.x, element.y, element.width, element.height);
        return distancePointPoint(point, elementRectangle.center());
    }
}

export function pointLinesDistance(point: Point, lines: [Point, Point][]): number {
    if (lines.length <= 0) {
        return Number.POSITIVE_INFINITY;
    }
    const distances = lines.map(([linePointA, linePointB]) => distancePointLine(point, new Line(linePointA, linePointB)));
    return Math.min(...distances);
}

export function calculateInfluenceMaxRange(element: ElementLike, point: Point, borderRadius: number): number {
    const { x: x1, y: y1, width: w, height: h } = element;
    const { x: x2, y: y2 } = point;

    // Calculate the center of the rectangle
    const x_c = x1 + w / 2;
    const y_c = y1 + h / 2;

    // Calculate the slope (m) and intercept (b) of the line
    const m = (y2 - y_c) / (x2 - x_c);
    const b = y_c - m * x_c;

    // Function to check intersection with rectangle edges
    function checkIntersection(x: number, y: number): boolean {
        return x >= x1 && x <= x1 + w && y >= y1 && y <= y1 + h;
    }

    // Function to check intersection with quarter circles
    function checkQuarterCircleIntersection(cx: number, cy: number, r: number, quadrant: string) {
        const A = 1 + m * m;
        const B = -2 * cx + 2 * m * (b - cy);
        const C = cx * cx + (b - cy) * (b - cy) - r * r;
        const D = B * B - 4 * A * C;

        if (D >= 0) {
            const x1 = (-B + Math.sqrt(D)) / (2 * A);
            const y1 = m * x1 + b;
            if (checkIntersection(x1, y1) && isInQuadrant(x1, y1, cx, cy, quadrant)) return { x: x1, y: y1 };

            const x2 = (-B - Math.sqrt(D)) / (2 * A);
            const y2 = m * x2 + b;
            if (checkIntersection(x2, y2) && isInQuadrant(x2, y2, cx, cy, quadrant)) return { x: x2, y: y2 };
        }
        return null;
    }

    // Function to check if a point is in the specified quadrant
    function isInQuadrant(x: number, y: number, cx: number, cy: number, quadrant: string): boolean {
        switch (quadrant) {
            case 'top-left':
                return x <= cx && y <= cy;
            case 'top-right':
                return x >= cx && y <= cy;
            case 'bottom-left':
                return x <= cx && y >= cy;
            case 'bottom-right':
                return x >= cx && y >= cy;
            default:
                return false;
        }
    }

    // Check intersection with rectangle edges
    let intersections = [];

    // Left edge
    let y = m * x1 + b;
    if (checkIntersection(x1, y) && y >= y1 + borderRadius && y <= y1 + h - borderRadius) intersections.push({ x: x1, y });

    // Right edge
    y = m * (x1 + w) + b;
    if (checkIntersection(x1 + w, y) && y >= y1 + borderRadius && y <= y1 + h - borderRadius) intersections.push({ x: x1 + w, y });

    // Top edge
    let x = (y1 - b) / m;
    if (checkIntersection(x, y1) && x >= x1 + borderRadius && x <= x1 + w - borderRadius) intersections.push({ x, y: y1 });

    // Bottom edge
    x = (y1 + h - b) / m;
    if (checkIntersection(x, y1 + h) && x >= x1 + borderRadius && x <= x1 + w - borderRadius) intersections.push({ x, y: y1 + h });

    // Check intersection with rounded corners
    const corners = [
        { cx: x1 + borderRadius, cy: y1 + borderRadius, quadrant: 'top-left' }, // Top-left
        { cx: x1 + w - borderRadius, cy: y1 + borderRadius, quadrant: 'top-right' }, // Top-right
        { cx: x1 + borderRadius, cy: y1 + h - borderRadius, quadrant: 'bottom-left' }, // Bottom-left
        { cx: x1 + w - borderRadius, cy: y1 + h - borderRadius, quadrant: 'bottom-right' } // Bottom-right
    ];

    corners.forEach(corner => {
        const intersection = checkQuarterCircleIntersection(corner.cx, corner.cy, borderRadius, corner.quadrant);
        if (intersection) intersections.push(intersection);
    });

    // Find the closest intersection point
    let minDistance = Infinity;

    intersections.forEach(intersection => {
        const distance = Math.sqrt((intersection.x - x_c) ** 2 + (intersection.y - y_c) ** 2);
        if (distance < minDistance) {
            minDistance = distance;
        }
    });

    return minDistance;
}
