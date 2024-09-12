import { useCallback, useEffect } from "react";

import Diagram from "diagram-js";

import type { OverlayDefinition, OverlayDefinitionBuilder, OverlayDefinitionsBuilder } from "../../../Modules/DynamicOverlays";
import { getDynamicOverlays } from "../../../util/services";
import useEventHandler from "../../hooks/useEventHandler";

const useOverlays = (diagram: Diagram | null, overlays: (OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder)[]): void => {
    const initializeOverlays = useCallback(() => {
        if (!diagram) {
            return [];
        }

        const overlayService = getDynamicOverlays(diagram);

        overlayService.clear();
        console.log("Removed all active overlays.");

        const ids = overlays.flatMap(overlayService.add);
        console.log(`Registered ${ids.length} overlays.`);

        return ids;
    }, [diagram, overlays]);

    useEventHandler(diagram, "import.done", initializeOverlays);

    useEffect(() => {
        const ids = initializeOverlays();
        return () => {
            if (diagram) {
                const overlayService = getDynamicOverlays(diagram);
                ids.forEach(id => overlayService.remove({ id }));
            }
        }
    }, [initializeOverlays]);
};

export default useOverlays;
