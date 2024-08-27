import { useCallback, useEffect } from "react";

import { isOverlayDefinition,isOverlayDefinitionBuilder, isOverlayDefinitionsBuilder } from "./BpmnViewer.types";
import { getCanvas, getElementRegistry, getEventBus, getOverlays } from "./serviceHelpers";

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

            overlayDefinitions.forEach(({type, element, config}) => {
                if (type) {
                    overlayService.add(element, type, config);
                } else {
                    overlayService.add(element, config);
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
