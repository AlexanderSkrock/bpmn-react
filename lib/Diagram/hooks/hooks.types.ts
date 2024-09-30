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
    /**
     * The element or its id the overlay should be attached to.
     */
    element: string | Element,
    /**
     * An optiona type this overlay belongs to.
     */
    type?: string,
    /**
     * Contains the html implementation of this overlay and information on its positioning.
     */
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

/**
 * The return type for the {@link useAttachedZoom} hook. As usual for React hooks it has an array-structure containing the following in order:
 * <ul>
 *     <li>current zoom factor</li>
 *     <li>function to zoom in</li>
 *     <li>function to zoom out</li>
 *     <li>function to fit zoom</li>
 *     <li>function to set the zoom factor to a specific value</li>
 * </ul>
 */
export type UseAttachedZoomResult = [
    /**
     * The current zoom factor.
     */
    number,
    /**
     * A function to increase the current zoom factor by the configured step size.
     */
    () => void,
    /**
     * A function to decrease the current zoom factor by the configured step size.
     */
    () => void,
    /**
     * A function to automatically fit the current diagram to viewport.
     */
    () => void,
    /**
     * A function to set the zoom factor to a specific value, while respect the lower and upper boundaries.
     */
    (nextZoom: number) => void,
]

