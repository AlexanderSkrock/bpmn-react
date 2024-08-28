import { useCallback, useEffect } from "react";

import { isOverlayDefinition,isOverlayDefinitionBuilder, isOverlayDefinitionsBuilder } from "./BpmnViewer.types";
import { getCanvas, getElementRegistry, getEventBus, getOverlays } from "./serviceHelpers";

const wrapOverlay = (config) => {
    const overlayContainer = document.createElement("div");
    overlayContainer.appendChild(config.html);
    return {
        ...config,
        html: overlayContainer,
    };
};

const wrapOverlayInteractive = (config) => {
    return wrapOverlay(config);
}

const wrapOverlayNonInteractive = (config) => {
    const wrappedOverlay = wrapOverlay(config);
    wrappedOverlay.html.classList.add("non-interactive");
    return wrappedOverlay;
}

const useOverlays = (diagram, overlays) => {
    const initializeOverlays = useCallback(() => {
        if (diagram) {
            const overlayService = getOverlays(diagram);
            overlayService.clear();
            console.log("Removed all active overlays.");

            const elementRegistry = getElementRegistry(diagram);

            const builderEnv = ({
                rootElement: () => getCanvas(diagram).getRootElement(),
                canvas: () => getCanvas(diagram),
            });

            const overlayDefinitions = [];
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
