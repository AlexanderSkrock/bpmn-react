import { ModuleDeclaration } from "diagram-js/lib/Diagram";
import SelectionModule from "diagram-js/lib/features/selection";
import CoreModule from 'bpmn-js/lib/core';

import { DynamicOverlaysModule } from "../DynamicOverlays";
import ProcessNavigation from "./ProcessNavigation";
import defaultControlRenderer from "./defaultControlRenderer";
import defaultOverlayRenderer from "./defaultOverlayRenderer";
import defaultCalledElementLoader from "./defaultCalledElementLoader";
import ProcessNavigationOverlayBehaviour from "./ProcessNavigationOverlayBehaviour";

const moduleDeclaration: ModuleDeclaration = {
    __depends__: [ CoreModule, SelectionModule, DynamicOverlaysModule ],
    __init__: [ "processNavigation", "processNavigationOverlayBehaviour" ],
    // Core
    processNavigation: [ "type", ProcessNavigation ],
    processNavigationOverlayBehaviour: [ "type", ProcessNavigationOverlayBehaviour ],
    // Customization
    processNavigationOverlayRenderer: [ "type", defaultOverlayRenderer ],
    processNavigationControlRenderer: [ "type", defaultControlRenderer ],
    calledElementLoader: [ "type", defaultCalledElementLoader ],
};

export default moduleDeclaration;
