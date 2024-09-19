import { useCallback, useEffect } from "react";

import { EventBusEventCallback } from "diagram-js/lib/core/EventBus";
import { ElementLike } from "diagram-js/lib/model/Types";

import { useEventHandler } from "../../Diagram";
import { useZoom } from "../../Components/Zoom";
import { DiagramLike, getCanvas } from "../../util/services";

import type { AttachedZoomOptions } from "./Zoom.types";


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
