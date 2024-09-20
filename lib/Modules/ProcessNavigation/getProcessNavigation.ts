import Diagram from "diagram-js";

import { DiagramLike } from "../../Diagram/services/services.types";
import { ProcessNavigationService } from "./ProcessNavigation.types";

export default (diagram: DiagramLike): ProcessNavigationService => {
    if (diagram instanceof Diagram) {
        return diagram.get("processNavigation");
    } else {
        return diagram.processNavigation as ProcessNavigationService;
    }
}
