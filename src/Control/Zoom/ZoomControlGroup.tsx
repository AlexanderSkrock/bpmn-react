import styled from "styled-components";

import useAttachedZoom from "./useAttachedZoom";
import { ZoomControlGroupProps, ZoomControlProps } from "./Zoom.types";

import ZoomFitButton from "./ZoomFitButton";
import ZoomInButton from "./ZoomInButton";
import ZoomOutButton from "./ZoomOutButton";

const HorizontalZoomControlContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
`;

const VerticalZoomControlContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
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
