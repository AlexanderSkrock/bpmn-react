import Diagram from "diagram-js";
import type { DynamicOverlays } from "../../Modules/DynamicOverlays";

export const getDynamicOverlays = (diagram: Diagram): DynamicOverlays => {
    return diagram.get("dynamicOverlays") as DynamicOverlays;
}