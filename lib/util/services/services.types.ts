import Diagram from "diagram-js";
import Canvas from "diagram-js/lib/core/Canvas";
import EventBus from "diagram-js/lib/core/EventBus";
import ElementRegistry from "diagram-js/lib/core/ElementRegistry";
import Overlays from "diagram-js/lib/features/overlays/Overlays";
import InteractionEvents from "diagram-js/lib/features/interaction-events/InteractionEvents";

import { DynamicOverlays } from "../../Modules/DynamicOverlays";
import { ProcessNavigation } from "../../Modules/ProcessNavigation";
import { Zoom } from "../../Modules/Zoom";

export type diagramServices = {
    // diagram-js
    "canvas": Canvas,
    "elementRegistry": ElementRegistry,
    "eventBus": EventBus,
    "interactionEvents": InteractionEvents
    "overlays": Overlays,

    // bpmn-react
    "dynamicOverlays": DynamicOverlays,
    "processNavigation": ProcessNavigation,
    "zoom": Zoom,
};

export type DiagramLike = Diagram | Partial<{ [Key in keyof diagramServices]: diagramServices[Key] }>;