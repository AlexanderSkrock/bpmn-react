import { useCallback, useState } from "react";
import { ZoomOptions } from "./Zoom.types";

/** Standard-Zoom (100%) */
const DEFAULT_ZOOM_LEVEL = 1;

/** Minimaler Zoomlevel (20%) */
const MIN_ZOOM_LEVEL = 0.2;
/** Maximaler Zoomlevel (700%) */
const MAX_ZOOM_LEVEL = 7;

/** Zoom Stufen -> 20% Schritte */
const ZOOM_STEP = 0.2;

const useZoom = ({ initialZoom = DEFAULT_ZOOM_LEVEL, minZoom = MIN_ZOOM_LEVEL, maxZoom = MAX_ZOOM_LEVEL, step = ZOOM_STEP }: ZoomOptions = {}): [number, () => void, () => void, (nextZoom: number) => void] => {
    const [currentZoom, setZoom] = useState<number>(initialZoom);

    const increaseZoom = useCallback(() => {
        setZoom(previousZoom => Math.min(previousZoom + step, maxZoom));
    }, [step, maxZoom]);
    const decreaseZoom = useCallback(() => {
        setZoom(previousZoom => Math.max(previousZoom - step, minZoom));
    }, [step, minZoom]);
    const safeSetZoom = useCallback((nextZoom: number) => {
        const zoom = Math.min(Math.max(nextZoom, minZoom), maxZoom);
        setZoom(zoom);
    }, [initialZoom, minZoom, maxZoom]);

    return [currentZoom, increaseZoom, decreaseZoom, safeSetZoom];
};

export default useZoom;
