import Diagram from "diagram-js";

import { DiagramLike } from "../../Diagram";
import type { DynamicOverlayService } from "./DynamicOverlays.types";

/**
 * Helper function to retrieve the {@link DynamicOverlayService} from a {@link DiagramLike} instance
 * @param diagram the diagram to work with
 */
export default (diagram: DiagramLike): DynamicOverlayService => {
    if (diagram instanceof Diagram) {
        return diagram.get("dynamicOverlays");
    } else {
        return diagram.dynamicOverlays as DynamicOverlayService;
    }
}
