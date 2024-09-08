import Diagram from "diagram-js";
import type { DynamicOverlayService } from "../../Modules/DynamicOverlays";

export const getDynamicOverlays = (diagram: Diagram): DynamicOverlayService => {
    return diagram.get("dynamicOverlays") as DynamicOverlayService;
}