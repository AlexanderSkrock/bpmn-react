import { ModuleDeclaration } from "diagram-js/lib/Diagram";

import OverlaysModule from 'diagram-js/lib/features/overlays';

import DynamicOverlays from "./DynamicOverlays";

const moduleDeclaration: ModuleDeclaration = {
    __depends__: [ OverlaysModule ],
    __init__: [ "dynamicOverlays" ],
    dynamicOverlays: [ "type", DynamicOverlays ]
};

export default moduleDeclaration;