import Diagram from "diagram-js";

import { DiagramLike } from "../../Diagram/services/services.types";
import Zoom from "./Zoom";

export default (diagram: DiagramLike): Zoom => {
    if (diagram instanceof Diagram) {
        return diagram.get("zoom");
    } else {
        return diagram.zoom as Zoom;
    }
}
