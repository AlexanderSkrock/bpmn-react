import { ModuleDeclaration } from "diagram-js/lib/Diagram";
import SelectionModule from "diagram-js/lib/features/selection";

import ProcessNavigation from "./ProcessNavigation";
import defaultProcessNavigationControlRenderer from "./defaultProcessNavigationControlRenderer";
import defaultCalledElementLoader from "./defaultCalledElementLoader";

const moduleDeclaration: ModuleDeclaration = {
    __depends__: [ SelectionModule ],
    __init__: [ "processNavigation" ],
    processNavigation: [ "type", ProcessNavigation ],
    calledElementLoader: [ "type", defaultCalledElementLoader ],
    processNavigationControlRenderer: [ "type", defaultProcessNavigationControlRenderer ],
};

export default moduleDeclaration;
