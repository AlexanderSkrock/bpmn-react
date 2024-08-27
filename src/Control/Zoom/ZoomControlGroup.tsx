import styled from "styled-components";

import useAttachedZoom from "./useAttachedZoom";
import { ZoomControlGroupProps, ZoomControlProps } from "./Zoom.types";

import ZoomFitButton from "./ZoomFitButton";
import ZoomInButton from "./ZoomInButton";
import ZoomOutButton from "./ZoomOutButton";

const HorizontalZoomControlContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const VerticalZoomControlContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const ZoomControlGroup = ({ direction = "horizontal", diagram, options }: ZoomControlGroupProps) => {
    const [, increaseZoom, decreaseZoom, fitZoom] = useAttachedZoom(diagram, options);

    const Container = direction === "horizontal" ? HorizontalZoomControlContainer : VerticalZoomControlContainer;

    return (
        <Container>
            <ZoomInButton onZoomIn={ increaseZoom } />
            <ZoomFitButton onZoomFit={ fitZoom }/>
            <ZoomOutButton onZoomOut={ decreaseZoom }/>
        </Container>
    )
};

export default ZoomControlGroup;
