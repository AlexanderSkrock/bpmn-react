import useAttachedZoom from "./useAttachedZoom";

import { ZoomFitButton } from "../../Components/Zoom";

import type { ZoomControlProps } from "./Zoom.types";

const ZoomFitControl = ({ diagram, options, title }: ZoomControlProps) => {
    const [,,, fitZoom] = useAttachedZoom(diagram, options);
    return <ZoomFitButton onZoomFit={ fitZoom } title={ title } />;
};

export default ZoomFitControl;
