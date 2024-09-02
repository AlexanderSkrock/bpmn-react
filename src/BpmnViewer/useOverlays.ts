import Diagram from "diagram-js";
import { OverlayAttrs } from "diagram-js/lib/features/overlays/Overlays";
import { useCallback, useEffect } from "react";

import { isOverlayDefinition,isOverlayDefinitionBuilder, isOverlayDefinitionsBuilder, OverlayDefinition, OverlayDefinitionBuilder, OverlayDefinitionsBuilder } from "./BpmnViewer.types";
import { getCanvas, getElementRegistry, getEventBus, getInteractionEvents, getOverlays } from "./serviceHelpers";
import { ElementLike } from "diagram-js/lib/model/Types";

const wrapOverlay = (config: OverlayAttrs): OverlayAttrs => {
    const overlayContainer = document.createElement("div");
    if (typeof config.html === "string") {
        overlayContainer.innerHTML = config.html;
    } else {
        overlayContainer.appendChild(config.html);
    }

    return {
        ...config,
        html: overlayContainer,
    };
};

const wrapOverlayInteractive = (config: OverlayAttrs): OverlayAttrs => {
    return wrapOverlay(config);
}

const wrapOverlayNonInteractive = (config: OverlayAttrs): OverlayAttrs => {
    const wrappedOverlay = wrapOverlay(config);
    if (typeof wrappedOverlay.html !== "string") {
        wrappedOverlay.html.classList.add("non-interactive");
    }
    return wrappedOverlay;
}

const useOverlays = (diagram: Diagram | null, overlays?: [ OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder ]): void => {
    const initializeOverlays = useCallback(() => {
        if (diagram) {
            const overlayService = getOverlays(diagram);
            overlayService.clear();
            console.log("Removed all active overlays.");

            const elementRegistry = getElementRegistry(diagram);

            const builderEnv = ({
                rootElement: () => getCanvas(diagram).getRootElement(),
                canvas: () => getCanvas(diagram),
                delegateEvent: (eventType: string, event: Event, targetElement: ElementLike) => {
                    const eventResult = getEventBus(diagram).fire(eventType, {
                        element: targetElement,
                        originalEvent: event
                    });
                
                    if (eventResult === false) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
            });

            const overlayDefinitions: OverlayDefinition[] = [];
            overlays?.forEach(overlay => {
                if (isOverlayDefinition(overlay)) {
                    overlayDefinitions.push(overlay);
                } else if (isOverlayDefinitionBuilder(overlay)) {
                    const elementFilter = overlay.elementFilter;
                    const elements = typeof elementFilter === 'string'
                        ? elementRegistry.filter(element => elementFilter === element.id)
                        : elementRegistry.filter(elementFilter);

                    elements.forEach(element => {
                        const buildResult = overlay.buildDefinition(element, builderEnv);
                        overlayDefinitions.push(buildResult);
                    })
                } else if (isOverlayDefinitionsBuilder(overlay)) {
                    const elements = overlay.elementFilter
                        ? elementRegistry.filter(overlay.elementFilter)
                        : elementRegistry.getAll();

                    const buildResults = overlay.buildDefinitions(elements, builderEnv);
                    buildResults.forEach(overlayDefinition => {
                        overlayDefinitions.push(overlayDefinition);
                    });
                }
            });

            overlayDefinitions.forEach(({type, element, interactive, config}) => {
                const overlayConfig = interactive
                    ? wrapOverlayInteractive(config)
                    : wrapOverlayNonInteractive(config);

                if (type) {
                    overlayService.add(element, type, overlayConfig);
                } else {
                    overlayService.add(element, overlayConfig);
                }
            });
            console.log(`Registered ${overlayDefinitions.length} overlays.`);
        }
    }, [diagram, overlays]);

    useEffect(() => {
        if (diagram) {
            getEventBus(diagram).on('import.done', initializeOverlays);
        }
        return () => {
            if (diagram) {
                getEventBus(diagram).off('import.done', initializeOverlays);
            }
        }
    }, [diagram, initializeOverlays]);

    useEffect(() => {
        initializeOverlays();
    }, [initializeOverlays]);
};

export default useOverlays;
