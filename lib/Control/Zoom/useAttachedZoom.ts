import { useCallback, useEffect } from "react";

import { EventBusEventCallback } from "diagram-js/lib/core/EventBus";

import useEventHandler from "../../Viewer/hooks/useEventHandler";
import { useZoom } from "../../Components/Zoom";
import { DiagramLike, getCanvas } from "../../util/services";

import { AttachedZoomOptions } from "./Zoom.types";


const useAttachedZoom = (diagramLike: DiagramLike | null, { initialFit, ...zoomOptions }: AttachedZoomOptions = {}): [number, () => void, () => void, () => void, (nextZoom: number) => void] => {
    const [currentZoom, increaseZoom, decreaseZoom, setZoom] = useZoom(zoomOptions)

    const zoom = useCallback((zoomValue: number | "fit-viewport") => {
        if (diagramLike) {
            const nextZoom = getCanvas(diagramLike).zoom(zoomValue);
            setZoom(nextZoom);
        }
    }, [diagramLike, setZoom])

    const fitZoom = useCallback(() => {
        zoom("fit-viewport");
    }, [zoom]);

    useEffect(() => {
        zoom(currentZoom);
    }, [zoom, currentZoom]);

    const handleRootSet: EventBusEventCallback<any> = useCallback(() => {
        if (initialFit) {
            fitZoom();
        }
    }, [initialFit, fitZoom]);
    useEventHandler(diagramLike, "root.set", handleRootSet);

    const handleScaleChanged: EventBusEventCallback<any> = useCallback(event => {
        setZoom(event.viewbox.scale);
    }, [setZoom]);
    useEventHandler(diagramLike, "canvas.viewbox.changed", handleScaleChanged);

    return [currentZoom, increaseZoom, decreaseZoom, fitZoom, setZoom];
};

export default useAttachedZoom;
