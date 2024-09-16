import { Geometry } from "./geometry.types";
import Rectangle from "./Rectangle";

export const area = (geometry: Geometry) => {
    if (geometry instanceof Rectangle) {
        return geometry.width * geometry.height;
    }
    throw new Error(`unsupported geometry '${typeof geometry}'`);
}
