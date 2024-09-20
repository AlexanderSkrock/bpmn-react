import Diagram from "diagram-js";

import { DiagramLike } from "../../Diagram";
import type { DynamicOverlayService } from "./DynamicOverlays.types";

export default (diagram: DiagramLike): DynamicOverlayService => {
    if (diagram instanceof Diagram) {
        return diagram.get("dynamicOverlays");
    } else {
        return diagram.dynamicOverlays as DynamicOverlayService;
    }
}
