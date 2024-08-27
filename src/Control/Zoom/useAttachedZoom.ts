import { useCallback, useEffect } from "react";
import useZoom from "./useZoom";
import { getCanvas, getEventBus } from "../../BpmnChart/serviceHelpers";
import Diagram from "diagram-js";
import { AttachedZoomOptions } from "./Zoom.types";

const useAttachedZoom = (diagram: Diagram, { initialFit, ...zoomOptions }: AttachedZoomOptions = {}) => {
    const [currentZoom, increaseZoom, decreaseZoom, setZoom] = useZoom(zoomOptions);

    const handleScaleChanged = useCallback(event => {
        setZoom(event.viewbox.scale);
    }, [setZoom]);

    const zoom = useCallback((zoomValue) => {
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

    useEffect(() => {
        if (diagram) {
            getEventBus(diagram).on("canvas.viewbox.changed", handleScaleChanged);
        }
        return () => {
            if (diagram) {
                getEventBus(diagram).off("canvas.viewbox.changed", handleScaleChanged);
            }
        }
    }, [diagram, handleScaleChanged]);

    return [currentZoom, increaseZoom, decreaseZoom, fitZoom, setZoom];
};

export default useAttachedZoom;
