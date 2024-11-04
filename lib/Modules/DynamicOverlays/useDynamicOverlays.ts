import { useCallback, useEffect, useMemo, useState } from "react";

import type { DiagramLike } from "../../Diagram";
import { useEventHandler } from "../../Diagram";

import type { Overlay } from "./DynamicOverlays.types";
import getDynamicOverlays from "./getDynamicOverlays";

/**
 * A custom React hook to simplify the usage of dynamic overlays. It handles diagram events and component lifecycle events appropriately, so you are only left with defining and changing your overlays.
 * @param diagram the diagram to work with
 * @param overlays the overlays to apply
 */
const useOverlays = (diagram: DiagramLike | null, overlays: Overlay[]): void => {
    const [overlayIds, setOverlayIds] = useState<string[]>([]);

    const overlayService = useMemo(() => diagram ? getDynamicOverlays(diagram) : null, [diagram]);

    const resetOverlays = useCallback(() => {
        if (overlayService) {
            overlayIds.forEach(id => overlayService.remove({ id }));
            setOverlayIds([]);
            console.log("Removed all active overlays.");
        }
    }, [overlayService, overlayIds]);

    const initializeOverlays = useCallback(() => {
        if (overlayService) {
            if (overlays) {
                const ids = overlays.flatMap(overlayService.add);
                setOverlayIds(ids);
                console.log(`Registered ${ids.length} overlays.`);
            } else {
                setOverlayIds([]);
                console.log("Registered no overlays.");
            }
        }
    }, [overlayService, overlays]);

    const configureOverlays = useCallback(() => {
        resetOverlays();
        initializeOverlays();
    }, [resetOverlays, initializeOverlays]);

    useEffect(() => {
        configureOverlays();
        return resetOverlays;
    }, [overlayService, overlays]);

    // Configure overlays on imports
    useEventHandler(diagram, "import.render.complete", configureOverlays);
    // Configure overlays on plane switching like navigating into embedded subprocesses
    useEventHandler(diagram, "root.set", configureOverlays);
};

export default useOverlays;
