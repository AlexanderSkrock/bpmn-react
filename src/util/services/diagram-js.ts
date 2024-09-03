import type Diagram from "diagram-js/lib/Diagram";
import type Canvas from "diagram-js/lib/core/Canvas";
import type ElementRegistry from "diagram-js/lib/core/ElementRegistry";
import type EventBus from "diagram-js/lib/core/EventBus";
import type InteractionEvents from "diagram-js/lib/features/interaction-events/InteractionEvents";
import type Overlays from "diagram-js/lib/features/overlays/Overlays";

export const getCanvas = (diagram: Diagram): Canvas => {
    return diagram.get("canvas") as Canvas;
}

export const getElementRegistry = (diagram: Diagram): ElementRegistry  => {
    return diagram.get("elementRegistry") as ElementRegistry;
}

export const getEventBus = (diagram: Diagram): EventBus => {
    return diagram.get("eventBus") as EventBus;
}

export const getInteractionEvents = (diagram: Diagram): InteractionEvents => {
    return diagram.get("interactionEvents") as InteractionEvents;
}

export const getOverlays = (diagram: Diagram): Overlays => {
    return diagram.get("overlays") as Overlays;
}