import { Element } from "diagram-js/lib/model/Types";
import { OverlayAttrs } from "diagram-js/lib/features/overlays/Overlays";
export type { EventBusEventCallback } from "diagram-js/lib/core/EventBus";
export type { Element } from "diagram-js/lib/model/Types";
export type { OverlayAttrs } from "diagram-js/lib/features/overlays/Overlays";

/**
 * A wrapper around the {@link OverlayAttrs} type provided by diagram-js.
 * <br />
 * This interface can be used to define overlays that can be passed to the {@link useOverlays} hook.
 */
export type Overlay = {
    element: string | Element,
    type?: string,
    attributes: OverlayAttrs
}

/**
 * Options to configure the behaviour of the {@link useAttachedZoom} hook.
 */
export interface AttachedZoomOptions extends ZoomOptions {
    /**
     * Flag whether the zoom should be initially set to fit the viewport.
     */
    initialFit?: boolean,
}

/**
 * Options to configure the behaviour of the {@link useZoom} hook.
 */
export interface ZoomOptions {
    /**
     * The initial zoom factor to be set.
     */
    initialZoom?: number;
    /**
     * The step size for zooming in and out.
     */
    step?: number;
    /**
     * The minimal zoom factor beyond which it is not possible to zoom out further.
     */
    minZoom?: number;
    /**
     * The maximal zoom factor beyond which it is not possible to zoom in further.
     */
    maxZoom?: number;
}
