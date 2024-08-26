import useAttachedZoom from "./useAttachedZoom";
import { ZoomControlProps } from "./Zoom.types";

import ZoomFitButton from "./ZoomFitButton";
import ZoomInButton from "./ZoomInButton";
import ZoomOutButton from "./ZoomOutButton";

const ZoomControlGroup = ({ diagram, options}: ZoomControlProps) => {
    const [, increaseZoom, decreaseZoom, fitZoom] = useAttachedZoom(diagram, options);

    return (
        <>
            <ZoomInButton onZoomIn={ increaseZoom } />
            <ZoomFitButton onZoomFit={ fitZoom }/>
            <ZoomOutButton onZoomOut={ decreaseZoom }/>
        </>
    )
};

export default ZoomControlGroup;