import useAttachedZoom from "./useAttachedZoom";

import { ZoomInButton } from "../../Components/Zoom";

import type { ZoomControlProps } from "./Zoom.types";

const ZoomInControl = ({ diagram, options }: ZoomControlProps) => {
    const [, increaseZoom] = useAttachedZoom(diagram, options);
    return <ZoomInButton onZoomIn={ increaseZoom } />;
};

export default ZoomInControl;
