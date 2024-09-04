import styled from "styled-components";

import useAttachedZoom from "./useAttachedZoom";
import { ZoomControlGroupProps, ZoomControlProps } from "./Zoom.types";

import ZoomFitButton from "./ZoomFitButton";
import ZoomInButton from "./ZoomInButton";
import ZoomOutButton from "./ZoomOutButton";

const ZoomControlContainer = styled.div`
    display: flex;
    gap: 8px;
`;

const HorizontalZoomControlContainer = styled(ZoomControlContainer)`
    flex-direction: row;
`;

const VerticalZoomControlContainer = styled(ZoomControlContainer)`
    flex-direction: column;
`;

const ZoomControlGroup = ({ direction = "horizontal", diagram, options, zoomInTitle, zoomOutTitle, zoomFitTitle }: ZoomControlGroupProps) => {
    const [, increaseZoom, decreaseZoom, fitZoom] = useAttachedZoom(diagram, options);

    const Container = direction === "horizontal" ? HorizontalZoomControlContainer : VerticalZoomControlContainer;

    return (
        <Container>
            <ZoomInButton onZoomIn={ increaseZoom } title={ zoomInTitle } />
            <ZoomFitButton onZoomFit={ fitZoom } title={ zoomOutTitle } />
            <ZoomOutButton onZoomOut={ decreaseZoom } title={ zoomFitTitle } />
        </Container>
    )
};

export default ZoomControlGroup;
