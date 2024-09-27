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

/**
 * The union type that contains all possibilities to define dynamic overlays.
 */
export type Overlay = OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder;

/**
 * A service complying with this interface is registered at the diagram instance. It defines the public api to work dynamic overlays.
 */
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

/**
 * This interface defines additional information that will be available to all {@link OverlayDefinitionBuilder} and {@link OverlayDefinitionsBuilder}.
 */
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

/**
 * A wrapper around the {@link OverlayAttrs} type provided by diagram-js.
 * <br />
 * This interface can be used to define static overlays and represents results of the builder types.
 * <br />
 * @see OverlayDefinitionBuilder
 * @see OverlayDefinitionsBuilder
 */
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

/**
 * The main interface to implement dynamic overlays. It allows to select elements that fulfill a filter criterion and maps them 1:1 to an {@link OverlayDefinition}.
 * For use cases that can not be implemented with this 1:1 mapping have a look at {@link OverlayDefinitionsBuilder}.
 */
export interface OverlayDefinitionBuilder {
    /**
     * The filter criterion to determine which elements this builder applies to.
     * For every element matching this criterion, the {@link buildDefinition} function will be called.
     */
    elementFilter: string | ElementRegistryFilterCallback;
    buildDefinition: (element: ElementLike, env: OverlayBuilderEnvironment) => OverlayDefinition;
}

/**
 * This interface can also be used to implement dynamic overlays. While {@link OverlayDefinitionBuilder} is sufficient most of the time,
 * this interface can be used to handle more complex scenarios where a 1:1 mapping of elements to overlays is not enough.
 */
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
