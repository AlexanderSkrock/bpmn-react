import BpmnViewer from "bpmn-js/lib/NavigatedViewer";
import Canvas from "diagram-js/lib/core/Canvas";

export const getCanvas = (viewer: BpmnViewer | undefined): Canvas | undefined => {
    if (!viewer) {
        return undefined;
    }
    return viewer.get("canvas") as Canvas;
}