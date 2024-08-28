import useAttachedZoom from "./useAttachedZoom";

import type { ZoomControlProps } from "./Zoom.types";
import ZoomFitButton from "./ZoomFitButton";

const ZoomFitControl = ({ diagram, options, title }: ZoomControlProps) => {
    const [,,, fitZoom] = useAttachedZoom(diagram, options);
    return <ZoomFitButton onZoomFit={ fitZoom } title={ title } />;
};

export default ZoomFitControl;