import React from "react";


import type { ZoomControlProps } from "./Zoom.types";
import { useAttachedZoom } from "../../Diagram";
import { ZoomFitButton } from "../../Components/Zoom";

const ZoomFitControl = ({ diagram, options, title }: ZoomControlProps) => {
    const [,,, fitZoom] = useAttachedZoom(diagram, options);
    return <ZoomFitButton onZoomFit={ fitZoom } title={ title } />;
};

export default ZoomFitControl;
