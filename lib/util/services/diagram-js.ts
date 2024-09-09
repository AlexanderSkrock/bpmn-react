import Diagram from "diagram-js/lib/Diagram";
import type Canvas from "diagram-js/lib/core/Canvas";
import type ElementRegistry from "diagram-js/lib/core/ElementRegistry";
import type EventBus from "diagram-js/lib/core/EventBus";
import type InteractionEvents from "diagram-js/lib/features/interaction-events/InteractionEvents";
import type Overlays from "diagram-js/lib/features/overlays/Overlays";

import { DiagramLike } from "./services.types";

export const getCanvas = (diagramLike: DiagramLike): Canvas => {
    if (diagramLike instanceof Diagram) {
        return diagramLike.get("canvas");
    } else {
        return diagramLike.canvas as Canvas;
    }
}

export const getElementRegistry = (diagramLike: DiagramLike): ElementRegistry  => {
    if (diagramLike instanceof Diagram) {
        return diagramLike.get("elementRegistry");
    } else {
        return diagramLike.elementRegistry as ElementRegistry;
    }
}

export const getEventBus = (diagramLike: DiagramLike): EventBus => {
    if (diagramLike instanceof Diagram) {
        return diagramLike.get("eventBus");
    } else {
        return diagramLike.eventBus as EventBus;
    }
}

export const getInteractionEvents = (diagramLike: DiagramLike): InteractionEvents => {
    if (diagramLike instanceof Diagram) {
        return diagramLike.get("interactionEvents");
    } else {
        return diagramLike.interactionEvents as InteractionEvents;
    }
}

export const getOverlays = (diagramLike: DiagramLike): Overlays => {
    if (diagramLike instanceof Diagram) {
        return diagramLike.get("overlays");
    } else {
        return diagramLike.overlays as Overlays;
    }
}
