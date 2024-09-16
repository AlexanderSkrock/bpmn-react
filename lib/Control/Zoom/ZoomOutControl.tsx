import React from "react";

import type { ZoomControlProps } from "./Zoom.types";
import useAttachedZoom from "./useAttachedZoom";
import { ZoomOutButton } from "../../Components/Zoom";


const ZoomOutControl = ({ diagram, options, title }: ZoomControlProps) => {
    const [,, decreaseZoom] = useAttachedZoom(diagram, options);
    return <ZoomOutButton onZoomOut={ decreaseZoom } title={ title } />;
};

export default ZoomOutControl;
