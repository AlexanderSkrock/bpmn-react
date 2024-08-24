export function getClosest(point, points) {
    let closestPoint = null;;
    let closesDistance = Number.POSITIVE_INFINITY;

    points.forEach(otherPoint => {
        const distance = pointDistance(point, otherPoint);
        if (distance < closesDistance) {
            closesDistance = distance;
            closestPoint = otherPoint;
        }
    });

    return closestPoint;
}

export function pointDistance(pointA, pointB) {
    return Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2));
}

export function distanceToEdge(centerX, centerY, W, H, x, y) {
    // Vector components
    const dx = x - centerX;
    const dy = y - centerY;

    // Intersection points
    let intersectX, intersectY;

    // Calculate intersection with the rectangle edges
    if (dx !== 0) {
        // Intersection with left and right edges
        const t1 = -centerX / dx;
        const t2 = (W - centerX) / dx;
        const y1 = centerY + t1 * dy;
        const y2 = centerY + t2 * dy;

        if (y1 >= 0 && y1 <= H) {
            intersectX = 0;
            intersectY = y1;
        } else if (y2 >= 0 && y2 <= H) {
            intersectX = W;
            intersectY = y2;
        }
    }

    if (dy !== 0) {
        // Intersection with top and bottom edges
        const t3 = -centerY / dy;
        const t4 = (H - centerY) / dy;
        const x1 = centerX + t3 * dx;
        const x2 = centerX + t4 * dx;

        if (x1 >= 0 && x1 <= W) {
            intersectX = x1;
            intersectY = 0;
        } else if (x2 >= 0 && x2 <= W) {
            intersectX = x2;
            intersectY = H;
        }
    }

    // Calculate the distance from the center to the intersection point
    const distance = Math.sqrt((intersectX - centerX) ** 2 + (intersectY - centerY) ** 2);
    return distance;
}