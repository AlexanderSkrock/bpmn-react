import Diagram from "diagram-js";
import type { DynamicOverlays } from "../../Modules/DynamicOverlays";
import { DiagramLike } from "./services.types";
import { ProcessNavigation } from "../../Modules/ProcessNavigation";
import { Zoom } from "../../Modules/Zoom";

export const getDynamicOverlays = (diagram: DiagramLike): DynamicOverlays => {
    if (diagram instanceof Diagram) {
        return diagram.get("dynamicOverlays");
    } else {
        return diagram.dynamicOverlays as DynamicOverlays;
    }
}

export const getProcessNavigation = (diagram: DiagramLike): ProcessNavigation => {
    if (diagram instanceof Diagram) {
        return diagram.get("processNavigation");
    } else {
        return diagram.processNavigation as ProcessNavigation;
    }
}

export const getZoom = (diagram: DiagramLike): Zoom => {
    if (diagram instanceof Diagram) {
        return diagram.get("zoom");
    } else {
        return diagram.zoom as Zoom;
    }
}
