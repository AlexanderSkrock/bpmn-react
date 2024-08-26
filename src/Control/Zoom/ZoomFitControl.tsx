import useAttachedZoom from "./useAttachedZoom";

import type { ZoomControlProps } from "./Zoom.types";
import ZoomFitButton from "./ZoomFitButton";

const ZoomFitControl = ({ diagram, options }: ZoomControlProps) => {
    const [,,,, fitZoom] = useAttachedZoom(diagram, options);
    return <ZoomFitButton onZoomFit={ fitZoom } />;
};

export default ZoomFitControl;