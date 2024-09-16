import React from "react";
import styled from "styled-components";

import { ZoomInButton, ZoomFitButton, ZoomOutButton } from "../../Components/Zoom";

import useAttachedZoom from "./useAttachedZoom";
import type { ZoomControlGroupProps } from "./Zoom.types";

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

const ZoomControlGroup = ({ direction = "horizontal", diagramLike, options, zoomInTitle, zoomOutTitle, zoomFitTitle }: ZoomControlGroupProps) => {
    const [, increaseZoom, decreaseZoom, fitZoom] = useAttachedZoom(diagramLike, options);

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
