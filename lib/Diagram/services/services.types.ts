import Diagram from "diagram-js";
import Canvas from "diagram-js/lib/core/Canvas";
import EventBus from "diagram-js/lib/core/EventBus";
import ElementRegistry from "diagram-js/lib/core/ElementRegistry";
import Overlays from "diagram-js/lib/features/overlays/Overlays";
import InteractionEvents from "diagram-js/lib/features/interaction-events/InteractionEvents";

type diagramServices = {
    "canvas": Canvas,
    "elementRegistry": ElementRegistry,
    "eventBus": EventBus,
    "interactionEvents": InteractionEvents
    "overlays": Overlays,
};

export type DiagramLike = Diagram | Partial<{ [Key in keyof diagramServices]: diagramServices[Key] }> & { [key: string]: unknown };