import { useCallback, useEffect } from "react";

import Diagram from "diagram-js";
import { EventBusEventCallback } from "diagram-js/lib/core/EventBus";

import useEventHandler from "../../Viewer/hooks/useEventHandler";
import { useZoom } from "../../Components/Zoom";
import { getCanvas } from "../../util/services";

import { AttachedZoomOptions } from "./Zoom.types";


const useAttachedZoom = (diagram: Diagram | null, { initialFit, ...zoomOptions }: AttachedZoomOptions = {}): [number | "fit-viewport", () => void, () => void, () => void, (nextZoom: number | "fit-viewport") => void] => {
    const [currentZoom, increaseZoom, decreaseZoom, setZoom] = useZoom(zoomOptions)

    const zoom = useCallback((zoomValue: number | "fit-viewport") => {
        if (diagram) {
            const nextZoom = getCanvas(diagram).zoom(zoomValue);
            setZoom(nextZoom);
        }
    }, [diagram, setZoom])

    const fitZoom = useCallback(() => {
        zoom("fit-viewport");
    }, [diagram]);

    useEffect(() => {
        zoom(currentZoom);
    }, [diagram, currentZoom]);

    useEffect(() => {
        if (diagram && initialFit) {
            fitZoom();
        }
    }, [diagram, initialFit]);

    const handleScaleChanged: EventBusEventCallback<any> = useCallback(event => {
        setZoom(event.viewbox.scale);
    }, [setZoom]);
    useEventHandler(diagram, "canvas.viewbox.changed", handleScaleChanged);

    return [currentZoom, increaseZoom, decreaseZoom, fitZoom, setZoom];
};

export default useAttachedZoom;
