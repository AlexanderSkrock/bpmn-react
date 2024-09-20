import { Element } from "diagram-js/lib/model/Types";
import { OverlayAttrs } from "diagram-js/lib/features/overlays/Overlays";

export type { EventBusEventCallback } from "diagram-js/lib/core/EventBus";
export type { Element } from "diagram-js/lib/model/Types";
export type { OverlayAttrs } from "diagram-js/lib/features/overlays/Overlays";

export type Overlay = {
    element: string | Element,
    type?: string,
    attributes: OverlayAttrs
}
