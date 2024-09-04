import { useMemo } from "react";
import styled from "styled-components";

import type { BreadcrumbsProps } from "./Breadcrumb.types";
import Breadcrumb from "./Breadcrumb";
import { joinClassNames } from "../../util/css";

const BreadcrumbContainer = styled.div`
    display: flex;
    gap: 8px;
`;

const HorizontalBreadcrumbContainer = styled(BreadcrumbContainer)`
    flex-direction: row;
`;

const VerticalBreadcrumbContainer = styled(BreadcrumbContainer)`
    flex-direction: column;
`;

export const breadcrumbsClassName = "breadcrumbs";

export default ({ path, onClick, direction = "horizontal", className }: BreadcrumbsProps) => {
    const classNames = useMemo(() => joinClassNames(className, breadcrumbsClassName), [className]);

    const Container = direction === "horizontal" ? HorizontalBreadcrumbContainer : VerticalBreadcrumbContainer;
    
    const breadcrumbs = useMemo(() => path.map((pathEntry, index) => (
        <Breadcrumb key={ `Breadcrumbs_${index}` } path={ pathEntry } onClick={ onClick } />
    )), [path, onClick]);

    return (
        <Container className={ classNames }>
            { breadcrumbs }
        </Container>
    );
}