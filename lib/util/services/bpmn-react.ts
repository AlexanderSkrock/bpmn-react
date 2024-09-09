import Diagram from "diagram-js";
import type { DynamicOverlays } from "../../Modules/DynamicOverlays";
import { DiagramLike } from "./services.types";
import { ProcessNavigation } from "../../Modules/ProcessNavigation";
import { Zoom } from "../../Modules/Zoom";

export const getDynamicOverlays = (diagramLike: DiagramLike): DynamicOverlays => {
    if (diagramLike instanceof Diagram) {
        return diagramLike.get("dynamicOverlays");
    } else {
        return diagramLike.dynamicOverlays as DynamicOverlays;
    }
}

export const getProcessNavigation = (diagramLike: DiagramLike): ProcessNavigation => {
    if (diagramLike instanceof Diagram) {
        return diagramLike.get("processNavigation");
    } else {
        return diagramLike.processNavigation as ProcessNavigation;
    }
}

export const getZoom = (diagramLike: DiagramLike): Zoom => {
    if (diagramLike instanceof Diagram) {
        return diagramLike.get("zoom");
    } else {
        return diagramLike.zoom as Zoom;
    }
}
