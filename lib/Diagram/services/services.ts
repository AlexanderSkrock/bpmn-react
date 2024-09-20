import Diagram from "diagram-js/lib/Diagram";
import type Canvas from "diagram-js/lib/core/Canvas";
import type ElementRegistry from "diagram-js/lib/core/ElementRegistry";
import type EventBus from "diagram-js/lib/core/EventBus";
import type InteractionEvents from "diagram-js/lib/features/interaction-events/InteractionEvents";
import type Overlays from "diagram-js/lib/features/overlays/Overlays";

import { DiagramLike } from "./services.types";

export const getCanvas = (diagram: DiagramLike): Canvas => {
    if (diagram instanceof Diagram) {
        return diagram.get("canvas");
    } else {
        return diagram.canvas as Canvas;
    }
}

export const getElementRegistry = (diagram: DiagramLike): ElementRegistry  => {
    if (diagram instanceof Diagram) {
        return diagram.get("elementRegistry");
    } else {
        return diagram.elementRegistry as ElementRegistry;
    }
}

export const getEventBus = <T> (diagram: DiagramLike): EventBus<T> => {
    if (diagram instanceof Diagram) {
        return diagram.get("eventBus");
    } else {
        return diagram.eventBus as EventBus<T>;
    }
}

export const getInteractionEvents = (diagram: DiagramLike): InteractionEvents => {
    if (diagram instanceof Diagram) {
        return diagram.get("interactionEvents");
    } else {
        return diagram.interactionEvents as InteractionEvents;
    }
}

export const getOverlays = (diagram: DiagramLike): Overlays => {
    if (diagram instanceof Diagram) {
        return diagram.get("overlays");
    } else {
        return diagram.overlays as Overlays;
    }
}
