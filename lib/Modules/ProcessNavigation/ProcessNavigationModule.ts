import { ModuleDeclaration } from "diagram-js/lib/Diagram";
import SelectionModule from "diagram-js/lib/features/selection";

import ProcessNavigation from "./ProcessNavigation";
import defaultProcessNavigationControlRenderer from "./defaultProcessNavigationControlRenderer";

const moduleDeclaration: ModuleDeclaration = {
    __depends__: [ SelectionModule ],
    __init__: [ "processNavigation" ],
    processNavigation: [ "type", ProcessNavigation ],
    processNavigationControlRenderer: [ "type", defaultProcessNavigationControlRenderer ],
};

export default moduleDeclaration;
