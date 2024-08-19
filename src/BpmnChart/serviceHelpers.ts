import BpmnViewer from "bpmn-js/lib/NavigatedViewer";
import Canvas from "diagram-js/lib/core/Canvas";
import ElementRegistry from "diagram-js/lib/core/ElementRegistry";
import Overlays from "diagram-js/lib/features/overlays/Overlays";

export const getCanvas = (viewer: BpmnViewer): Canvas => {
    return viewer.get("canvas") as Canvas;
}

export const getOverlays = (viewer: BpmnViewer): Overlays => {
    return viewer.get("overlays") as Overlays;
}

export const getElementRegistry = (viewer: BpmnViewer): ElementRegistry  => {
    return viewer.get("elementRegistry") as ElementRegistry;
}
