import useAttachedZoom from "./useAttachedZoom";

import type { ZoomControlProps } from "./Zoom.types";
import ZoomOutButton from "./ZoomOutButton";

const ZoomOutControl = ({ diagram, options, title }: ZoomControlProps) => {
    const [,, decreaseZoom] = useAttachedZoom(diagram, options);
    return <ZoomOutButton onZoomOut={ decreaseZoom } title={ title } />;
};

export default ZoomOutControl;