import React from "react";

import type { ZoomControlProps } from "./Zoom.types";
import { useAttachedZoom } from "../../Diagram";
import { ZoomInButton } from "../../Components/Zoom";

const ZoomInControl = ({ diagram, options }: ZoomControlProps) => {
    const [, increaseZoom] = useAttachedZoom(diagram, options);
    return <ZoomInButton onZoomIn={ increaseZoom } />;
};

export default ZoomInControl;
