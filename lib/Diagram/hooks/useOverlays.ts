import { useCallback, useEffect, useMemo, useState } from "react";

import type { DiagramLike } from "../services";
import { getOverlays } from "../services";

import useEventHandler from "./useEventHandler";
import { Overlay } from "./hooks.types";

/**
 * A React hook to simplify the usage of Overlays. This requires the `Overlays` module to be configured.
 * @param diagram the diagram instance at which the overlays should be registered.
 * @param overlays the overlays which should be managed.
 */
const useOverlays = (diagram: DiagramLike | null, overlays: Overlay[]): void => {
    const [overlayIds, setOverlayIds] = useState<string[]>([]);

    const overlayService = useMemo(() => diagram ? getOverlays(diagram) : null, [diagram]);

    const resetOverlays = useCallback(() => {
        if (overlayService) {
            overlayIds.forEach(id => overlayService.remove({ id }));
            setOverlayIds([]);
            console.log("Removed all active overlays.");
        }
    }, [overlayService, overlayIds]);

    const initializeOverlays = useCallback(() => {
        if (overlayService) {
            const ids = overlays.map(({ element, type, attributes }) => {
                return type
                    ? overlayService.add(element, type, attributes)
                    : overlayService.add(element, attributes);
            });
            setOverlayIds(ids);
            console.log(`Registered ${ids.length} overlays.`);
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

    useEventHandler(diagram, "import.render.complete", configureOverlays);
};

export default useOverlays;
