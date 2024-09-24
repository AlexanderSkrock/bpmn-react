import type { Element } from "diagram-js/lib/model";
import type { ElementLike } from "diagram-js/lib/model/Types";
import type { ElementRegistryFilterCallback } from "diagram-js/lib/core/ElementRegistry";
import type Canvas from "diagram-js/lib/core/Canvas";
import type { OverlayAttrs, OverlaysFilter } from "diagram-js/lib/features/overlays/Overlays";

export type { Element } from "diagram-js/lib/model";
export type { ElementLike } from "diagram-js/lib/model/Types";
export type { ElementRegistryFilterCallback } from "diagram-js/lib/core/ElementRegistry";
export type { default as Canvas } from "diagram-js/lib/core/Canvas";
export type { OverlayAttrs, OverlaysFilter } from "diagram-js/lib/features/overlays/Overlays";

export type Overlay = OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder;

export interface DynamicOverlayService {
    /**
     * Registers an overlay at the Diagram
     * @param overlay the overlay to register
     */
    add: (overlay: Overlay) => string[];
    /**
     * Unregisters an overlay from the diagram
     * @param filter
     */
    remove: (filter: OverlaysFilter) => void;
    /**
     * Unregisters all overlays from the diagram
     */
    clear: () => void;
}

export interface OverlayBuilderEnvironment {
    /**
     * Provides the current root element of the diagram
     */
    rootElement: () => ElementLike;
    /**
     * Provides the canvas instance of the diagram
     */
    canvas: () => Canvas;
    /**
     * Utility to delegate an event that happened on an interactive overlay to a specific element.
     * @param eventType the event type to trigger for the selected element
     * @param event the native event to delegate
     * @param element the element that receives the event
     */
    delegateEvent: (eventType: string, event: Event, element: ElementLike) => void;
}

export interface OverlayDefinition {
    /**
     * The type of overlay. This attribute can be used to classify overlays and group the together.
     * This also allows to filter all overlays of the matching type, e.g. to remove all of them.
     */
    type?: string;
    /**
     * Define whether this overlay is interactive. If true, the overlay will catch all pointer events.
     * If false, which it is by default, the overlays will not be able to catch pointer events.
     */
    interactive?: boolean;
    /**
     * The element this overlay is attached to. This is especially important for positioning as well,
     * but can also be important, when you make use of removing all overlays for a specific element.
     */
    element: string | Element;
    /**
     * The actual config for this overlay, consisting of the positioning relative the selected element and the presentation.
     */
    config: OverlayAttrs;
}

export interface OverlayDefinitionBuilder {
    /**
     * The filter criterion to determine which elements this builder applies to.
     * For every element matching this criterion, the {@link buildDefinition} function will be called.
     */
    elementFilter: string | ElementRegistryFilterCallback;
    buildDefinition: (element: ElementLike, env: OverlayBuilderEnvironment) => OverlayDefinition;
}

export interface OverlayDefinitionsBuilder {
    /**
     * The filter criterion to determine which elements this builder applies to.
     * All elements matching this criterion, will be passed to {@link buildDefinitions} function.
     */
    elementFilter?: ElementRegistryFilterCallback;
    /**
     * Build an arbitrary number of overlays for the given elements.
     * @param elements all elements that matched the {@link elementFilter}
     * @param env the environment of the current diagram instance
     */
    buildDefinitions: (elements: ElementLike[], env: OverlayBuilderEnvironment) => OverlayDefinition[];
}

export function isOverlayDefinition(o: Overlay): o is OverlayDefinition {
    const overlay = o as OverlayDefinition;
    return !!overlay.element && !!overlay.config;
}

export function isOverlayDefinitionBuilder(o: Overlay): o is OverlayDefinitionBuilder {
    const singleBuilder = o as OverlayDefinitionBuilder;
    return !!singleBuilder.buildDefinition;
}

export function isOverlayDefinitionsBuilder(o: Overlay): o is OverlayDefinitionsBuilder {
    const multipleBuilder = o as OverlayDefinitionsBuilder;
    return !!multipleBuilder.buildDefinitions;
}
