import React, { useCallback, useMemo } from "react";
import styled from "styled-components";

import { BreadcrumbProps } from "./Breadcrumb.types";
import { joinClassNames } from "../../util/css";
import { breadcrumbClassName } from "./classNames";

const arrowSize = "10px";

const BreadcrumbContainer = styled.div`
  background-color: seagreen;
`;

const HorizontalBreadcrumbContainer = styled(BreadcrumbContainer)`
  padding: 5px calc(${arrowSize} + 5px);

  clip-path: polygon(0 0, calc(100% - ${arrowSize}) 0, 100% 50%, calc(100% - ${arrowSize}) 100%, 0% 100%, ${arrowSize} 50%);
`;

const VerticalBreadcrumbContainer = styled(BreadcrumbContainer)`
  padding: calc(${arrowSize} + 5px) 5px;

  clip-path: polygon(0 0, 50% ${arrowSize}, 100% 0, 100% calc(100% - ${arrowSize}), 50% 100%, 0% calc(100% - ${arrowSize}));
`;

const Breadcrumb = ({ path, onClick, direction = "horizontal", className }: BreadcrumbProps) => {
    const classNames = useMemo(() => joinClassNames(className, breadcrumbClassName), [className]);

    const Container = direction === "horizontal" ? HorizontalBreadcrumbContainer : VerticalBreadcrumbContainer;

    const handleClick = useCallback(() => {
      const effectiveOnClick = path.onClick ?? onClick;
      effectiveOnClick?.(path)
    }, [path, onClick]);

    return (
        <Container onClick={ handleClick } className={ classNames }>
            { path.name ?? path.key }
        </Container>
    );
};

export default Breadcrumb;
