import Diagram from "diagram-js";
import type { DynamicOverlays } from "../../Modules/DynamicOverlays";
import { DiagramLike } from "./services.types";

export const getDynamicOverlays = (diagramLike: DiagramLike): DynamicOverlays => {
    if (diagramLike instanceof Diagram) {
        return diagramLike.get("dynamicOverlays");
    } else {
        return diagramLike.dynamicOverlays as DynamicOverlays;
    }
}
