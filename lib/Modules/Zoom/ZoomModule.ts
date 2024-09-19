import { ModuleDeclaration } from "diagram-js/lib/Diagram";

import Zoom from "./Zoom";
import DefaultControlRenderer from "./defaultControlRenderer";

const moduleDeclaration: ModuleDeclaration = {
    __init__: [ "zoom" ],
    zoom: [ "type", Zoom ],
    zoomControlRenderer: [ "type", DefaultControlRenderer ]
};

export default moduleDeclaration;
