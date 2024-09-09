import { ModuleDeclaration } from "diagram-js/lib/Diagram";

import ProcessNavigation from "./ProcessNavigation";

const moduleDeclaration: ModuleDeclaration = {
    __init__: [ "processNavigation" ],
    processNavigation: [ "type", ProcessNavigation ]
};

export default moduleDeclaration;
