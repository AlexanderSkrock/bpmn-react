import { ModuleDeclaration } from "diagram-js/lib/Diagram";

import Zoom from "./Zoom";

const moduleDeclaration: ModuleDeclaration = {
    __init__: [ "zoom" ],
    zoom: [ "type", Zoom ]
};

export default moduleDeclaration;
