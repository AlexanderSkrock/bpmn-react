import { useCallback, useEffect } from "react";

import { EventBusEventCallback } from "diagram-js/lib/core/EventBus";
import { ElementLike } from "diagram-js/lib/model/Types";

import { DiagramLike, getCanvas } from "../services";
import type { AttachedZoomOptions } from "./hooks.types";
import useEventHandler from "./useEventHandler"
import useZoom from "./useZoom";

/**
 * This hook handles the integration with the zoom API of `diagram-js` and allows modifying the current zoom while staying in sync with external changes to the zoom level.
 * @param diagram diagram instance to attach to
 * @param options configuration of the zoom behaviour 
 * @returns 
 */
const useAttachedZoom = (diagram: DiagramLike | null, { initialFit, ...zoomOptions }: AttachedZoomOptions = {}): [number, () => void, () => void, () => void, (nextZoom: number) => void] => {
    const [currentZoom, increaseZoom, decreaseZoom, setZoom] = useZoom(zoomOptions)

    const zoom = useCallback((zoomValue: number | "fit-viewport") => {
        if (diagram) {
            const nextZoom = getCanvas(diagram).zoom(zoomValue);
            setZoom(nextZoom);
        }
    }, [diagram, setZoom])

    const fitZoom = useCallback(() => {
        zoom("fit-viewport");
    }, [zoom]);

    useEffect(() => {
        zoom(currentZoom);
    }, [zoom, currentZoom]);

    const handleRootSet: EventBusEventCallback<{ element: ElementLike}> = useCallback(() => {
        if (initialFit) {
            fitZoom();
        }
    }, [initialFit, fitZoom]);
    useEventHandler(diagram, "root.set", handleRootSet);

    const handleScaleChanged: EventBusEventCallback<{ viewbox: { scale: number }}> = useCallback(event => {
        setZoom(event.viewbox.scale);
    }, [setZoom]);
    useEventHandler(diagram, "canvas.viewbox.changed", handleScaleChanged);

    return [currentZoom, increaseZoom, decreaseZoom, fitZoom, setZoom];
};

export default useAttachedZoom;
