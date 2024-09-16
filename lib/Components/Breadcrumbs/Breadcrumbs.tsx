import React, { useMemo } from "react";
import styled from "styled-components";

import type { BreadcrumbsProps } from "./Breadcrumb.types";
import Breadcrumb from "./Breadcrumb";
import { joinClassNames } from "../../util/css";
import { breadcrumbsClassName } from "./classNames";

const BreadcrumbContainer = styled.div`
    display: flex;
    gap: 8px;
`;

const HorizontalBreadcrumbContainer = styled(BreadcrumbContainer)`
    flex-direction: row;
    height: fit-content;
`;

const VerticalBreadcrumbContainer = styled(BreadcrumbContainer)`
    flex-direction: column;
    width: fit-content;
`;

const Breadcrumbs = ({ path, onClick, direction = "horizontal", className }: BreadcrumbsProps) => {
    const classNames = useMemo(() => joinClassNames(className, breadcrumbsClassName), [className]);

    const Container = direction === "horizontal" ? HorizontalBreadcrumbContainer : VerticalBreadcrumbContainer;

    const breadcrumbs = useMemo(() => path.map((pathEntry) => (
        <Breadcrumb key={ `Breadcrumbs_${pathEntry.key}` } path={ pathEntry } onClick={ onClick } direction={ direction } />
    )), [path, onClick]);

    return (
        <Container className={ classNames }>
            { breadcrumbs }
        </Container>
    );
};

export default Breadcrumbs;