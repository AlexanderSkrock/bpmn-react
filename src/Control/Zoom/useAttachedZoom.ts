import { useCallback, useEffect } from "react";
import useZoom from "./useZoom";
import { getCanvas, getEventBus } from "../../BpmnChart/serviceHelpers";
import Diagram from "diagram-js";
import { ZoomOptions } from "./Zoom.types";

const useAttachedZoom = (diagram: Diagram, options: ZoomOptions) => {
    const [currentZoom, increaseZoom, decreaseZoom, setZoom] = useZoom(options);

    useEffect(() => {
        if (diagram) {
            getCanvas(diagram).zoom(currentZoom, "auto");
        }
    }, [diagram, currentZoom]);

    const fitZoom = useCallback(() => {
        if (diagram) {
            getCanvas(diagram).zoom("fit-viewport");
        }
    }, [diagram]);

    const handleScaleChanged = useCallback(event => {
        setZoom(event.viewbox.scale);
    }, [setZoom]);

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