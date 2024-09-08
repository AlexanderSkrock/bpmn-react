import ElementRegistry from "diagram-js/lib/core/ElementRegistry";
import EventBus from "diagram-js/lib/core/EventBus";
import Overlays, { Canvas, OverlaysFilter } from "diagram-js/lib/features/overlays/Overlays";
import type { DynamicOverlayService, ElementLike, OverlayDefinition, OverlayDefinitionBuilder, OverlayDefinitionsBuilder } from "./DynamicOverlays.types";
import { isOverlayDefinition, isOverlayDefinitionBuilder, isOverlayDefinitionsBuilder } from "./DynamicOverlays.types";
import { wrapOverlayInteractive, wrapOverlayNonInteractive } from "./utils";

class DynamicOverlays implements DynamicOverlayService {

    static $inject = [
        "eventBus",
        "canvas",
        "elementRegistry",
        "overlays",
    ];

    _eventBus: EventBus;
    _canvas: Canvas;
    _elementRegistry: ElementRegistry;
    _overlays: Overlays;

    constructor(eventBus: EventBus, canvas: Canvas, elementRegistry: ElementRegistry, overlays: Overlays) {
        this._eventBus = eventBus;
        this._canvas = canvas;
        this._elementRegistry = elementRegistry;
        this._overlays = overlays;
    
        /*
        Add styling to djs-overlay
    
        this._overlays._overlayRoot
        .djs-overlay:has(.non-interactive) {
            pointer-events: none;
        }
        */
    };

    add = (overlay: OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder): string[] => {
        const overlayDefinitions = this._toOverlayDefinitions(overlay);
    
        const ids: string[] = [];
    
        overlayDefinitions.forEach(({ type, element, interactive, config }: OverlayDefinition) => {
            const overlayConfig = interactive
                ? wrapOverlayInteractive(config)
                : wrapOverlayNonInteractive(config);
    
            if (type) {
                const addedId = this._overlays.add(element, type, overlayConfig);
                ids.push(addedId);
            } else {
                const addedId = this._overlays.add(element, overlayConfig);
                ids.push(addedId);
            }
        });
    
        return ids;
    }

    remove = (filter: OverlaysFilter) => {
        this._overlays.remove(filter);
    }

    clear = () => {
        this._overlays.clear();
    }

    _toOverlayDefinitions = (overlay: OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder): OverlayDefinition[] => {
        if (isOverlayDefinition(overlay)) {
            return [overlay];
        } else if (isOverlayDefinitionBuilder(overlay)) {
            const elementFilter = overlay.elementFilter;
            const elements = typeof elementFilter === 'string'
                ? this._elementRegistry.filter(element => elementFilter === element.id)
                : this._elementRegistry.filter(elementFilter);
    
            return elements.map(element => overlay.buildDefinition(element, this._builderEnv()));
        } else if (isOverlayDefinitionsBuilder(overlay)) {
            const elements = overlay.elementFilter
                ? this._elementRegistry.filter(overlay.elementFilter)
                : this._elementRegistry.getAll();
    
            return overlay.buildDefinitions(elements, this._builderEnv());
        } else {
            return [];
        }
    }

    _builderEnv = () => ({
        rootElement: () => this._canvas.getRootElement(),
        canvas: () => this._canvas,
        delegateEvent: (eventType: string, event: Event, targetElement: ElementLike) => {
            const eventResult = this._eventBus.fire(eventType, {
                element: targetElement,
                originalEvent: event
            });
        
            if (eventResult === false) {
                event.stopPropagation();
                event.preventDefault();
            }
        }
    });
}

export default DynamicOverlays;