import React, { useCallback, useMemo } from "react";
import styled from "styled-components";

import { BreadcrumbProps } from "./Breadcrumb.types";
import { joinClassNames } from "../../util/css";

export const breadcrumbClassName = "breadcrumbs";

const arrowSize = "10px";

const BreadcrumbContainer = styled.div`
  padding: 5px calc(${arrowSize} + 5px);
  
  width: fit-content;
  
  background-color: seagreen;
`;

const HorizontalBreadcrumbContainer = styled(BreadcrumbContainer)`
  clip-path: polygon(0 0, calc(100% - ${arrowSize}) 0, 100% 50%, calc(100% - ${arrowSize}) 100%, 0% 100%, ${arrowSize} 50%);
`;

const VerticalBreadcrumbContainer = styled(BreadcrumbContainer)`
  clip-path: polygon(0 0, 50% ${arrowSize}, 100% 0, 100% calc(100% - ${arrowSize}), 50% 100%, 0% calc(100% - ${arrowSize}));
`;

export default ({ path, onClick, direction = "horizontal", className }: BreadcrumbProps) => {
    const classNames = useMemo(() => joinClassNames(className, breadcrumbClassName), [className]);

    const Container = direction === "horizontal" ? HorizontalBreadcrumbContainer : VerticalBreadcrumbContainer;

    const handleClick = useCallback(() => {
        onClick?.(path)
    }, [path, onClick]);

    return (
        <Container onClick={ handleClick } className={ classNames }>
            { path.name ?? path.key }
        </Container>
    );
}
