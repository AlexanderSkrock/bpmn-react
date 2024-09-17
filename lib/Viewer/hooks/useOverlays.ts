import { useCallback, useEffect, useMemo, useState } from "react";

import type { OverlayDefinition, OverlayDefinitionBuilder, OverlayDefinitionsBuilder } from "../../Modules/DynamicOverlays";
import type { DiagramLike } from "../../util/services";
import { getDynamicOverlays } from "../../util/services";
import useEventHandler from "./useEventHandler";

const useOverlays = (diagram: DiagramLike | null, overlays: (OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder)[]): void => {
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
            const ids = overlays.flatMap(overlayService.add);
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
