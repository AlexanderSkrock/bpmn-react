import useAttachedZoom from "./useAttachedZoom";

import type { ZoomControlProps } from "./Zoom.types";
import ZoomInButton from "./ZoomInButton";

const ZoomInControl = ({ diagram, options }: ZoomControlProps) => {
    const [, increaseZoom] = useAttachedZoom(diagram, options);
    return <ZoomInButton onZoomIn={ increaseZoom } />;
};

export default ZoomInControl;