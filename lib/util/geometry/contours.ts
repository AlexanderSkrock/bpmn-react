import { difference, feature, featureCollection } from "@turf/turf";
import { contours as contoursD3, ContourMultiPolygon } from "d3";

export const contours = (values: number[], width: number, height: number, thresholds: number): ContourMultiPolygon[] => {
    const contoursGenerator = contoursD3().size([width, height]).thresholds(10);
    return contoursGenerator(values);
}

export const nonOverlappingContours = (values: number[], width: number, height: number, thresholds: number): ContourMultiPolygon[] => {
    const overlappingContours = contours(values, width, height, thresholds);

    const nonOverlappingContours = [];
    for (let i = 0; i < overlappingContours.length; i++) {
        const c = overlappingContours[i];
        const nextC = overlappingContours[i + 1];
        if (nextC) {
            const cleanedContur = difference(featureCollection([
                feature(c),
                feature(nextC),
            ]));
            if (cleanedContur) {
                const cleanedGeometry = { ...c, ...cleanedContur.geometry } as ContourMultiPolygon
                nonOverlappingContours.push(cleanedGeometry);
            }
        } else {
            nonOverlappingContours.push(c);
        }
    }
    return nonOverlappingContours;
}