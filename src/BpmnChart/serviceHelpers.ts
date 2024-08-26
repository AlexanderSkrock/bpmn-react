import Diagram from "diagram-js/lib/Diagram";
import Canvas from "diagram-js/lib/core/Canvas";
import ElementRegistry from "diagram-js/lib/core/ElementRegistry";
import EventBus from "diagram-js/lib/core/EventBus";
import Overlays from "diagram-js/lib/features/overlays/Overlays";

export const getCanvas = (diagram: Diagram): Canvas => {
    return diagram.get("canvas") as Canvas;
}

export const getElementRegistry = (diagram: Diagram): ElementRegistry  => {
    return diagram.get("elementRegistry") as ElementRegistry;
}

export const getEventBus = (diagram: Diagram): EventBus => {
    return diagram.get("eventBus") as EventBus;
}

export const getOverlays = (diagram: Diagram): Overlays => {
    return diagram.get("overlays") as Overlays;
}