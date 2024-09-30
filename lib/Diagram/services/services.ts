import Diagram from "diagram-js/lib/Diagram";
import type Canvas from "diagram-js/lib/core/Canvas";
import type ElementRegistry from "diagram-js/lib/core/ElementRegistry";
import type EventBus from "diagram-js/lib/core/EventBus";
import type InteractionEvents from "diagram-js/lib/features/interaction-events/InteractionEvents";
import type Overlays from "diagram-js/lib/features/overlays/Overlays";

import { DiagramLike } from "./services.types";

/**
 * Helper function to retrieve the {@link Canvas} from a diagram.
 * @param diagram the diagram to work with
 */
export const getCanvas = (diagram: DiagramLike): Canvas => {
    if (diagram instanceof Diagram) {
        return diagram.get("canvas");
    } else {
        return diagram.canvas as Canvas;
    }
}

/**
 * Helper function to retrieve the {@link ElementRegistry} from a diagram.
 * @param diagram the diagram to work with
 */
export const getElementRegistry = (diagram: DiagramLike): ElementRegistry  => {
    if (diagram instanceof Diagram) {
        return diagram.get("elementRegistry");
    } else {
        return diagram.elementRegistry as ElementRegistry;
    }
}

/**
 * Helper function to retrieve the {@link EventBus} from a diagram.
 * @param diagram the diagram to work with
 */
export const getEventBus = <T> (diagram: DiagramLike): EventBus<T> => {
    if (diagram instanceof Diagram) {
        return diagram.get("eventBus");
    } else {
        return diagram.eventBus as EventBus<T>;
    }
}

/**
 * Helper function to retrieve the {@link InteractionEvents} from a diagram.
 * This only works when the interaction events module is activated.
 * @param diagram the diagram to work with
 */
export const getInteractionEvents = (diagram: DiagramLike): InteractionEvents => {
    if (diagram instanceof Diagram) {
        return diagram.get("interactionEvents");
    } else {
        return diagram.interactionEvents as InteractionEvents;
    }
}

/**
 * Helper function to retrieve the {@link Overlays} from a diagram.
 * This only works when the overlays module is activated.
 * @param diagram the diagram to work with
 */
export const getOverlays = (diagram: DiagramLike): Overlays => {
    if (diagram instanceof Diagram) {
        return diagram.get("overlays");
    } else {
        return diagram.overlays as Overlays;
    }
}
