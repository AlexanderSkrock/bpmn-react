import Diagram from "diagram-js";
import Canvas from "diagram-js/lib/core/Canvas";
import EventBus from "diagram-js/lib/core/EventBus";
import ElementRegistry from "diagram-js/lib/core/ElementRegistry";
import Overlays from "diagram-js/lib/features/overlays/Overlays";
import InteractionEvents from "diagram-js/lib/features/interaction-events/InteractionEvents";

/**
 * A compound types which contains a growing collection of known {@link Diagram} services.
 */
export type DiagramServices = {
    "canvas": Canvas,
    "elementRegistry": ElementRegistry,
    "eventBus": EventBus,
    "interactionEvents": InteractionEvents
    "overlays": Overlays,
};

/**
 * A type alias which represents either a {@link Diagram} or a similar object which provides a varying number of services.
 */
export type DiagramLike = Diagram | Partial<{ [Key in keyof DiagramServices]: DiagramServices[Key] }> & { [key: string]: unknown };
