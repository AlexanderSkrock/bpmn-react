import { ModuleDeclaration } from "diagram-js/lib/Diagram";

import ProcessNavigation from "./ProcessNavigation";
import SelectionModule from "diagram-js/lib/features/selection";

const moduleDeclaration: ModuleDeclaration = {
    __depends__: [ SelectionModule ],
    __init__: [ "processNavigation" ],
    processNavigation: [ "type", ProcessNavigation ]
};

export default moduleDeclaration;
