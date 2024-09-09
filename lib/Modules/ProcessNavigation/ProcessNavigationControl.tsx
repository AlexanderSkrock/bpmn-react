import React from "react";
import { Root } from "react-dom/client";
import styled from "styled-components";

import { breadcrumbClassName, Breadcrumbs } from "../../Components/Breadcrumbs";
import { ProcessNavigationControlProps } from "./ProcessNavigation.types";

const processBreadcrumbClassName = "breadcrumb-process";
const subProcessBreadcrumbClassName = "breadcrumb-subProcess";

const NavigationContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    .${breadcrumbClassName}:has(.${processBreadcrumbClassName}) {
        background-color: seagreen;
    }

    .${breadcrumbClassName}:has(.${subProcessBreadcrumbClassName}) {
        background-color: darkseagreen;
    }
`;

export const renderProcessNavigation = (root: Root, { history, path, onHistoryClick, onPathClick }: ProcessNavigationControlProps) => {
    const entries = [
        ...history.map(({ key, name }) => ({
            key,
            name: <div className={ processBreadcrumbClassName }>{ name }</div>,
            onClick: onHistoryClick,
        })),
        ...path.slice(1).map(({ key, name }) => ({
            key,
            name: <div className={ subProcessBreadcrumbClassName }>{ name }</div>,
            onClick: onPathClick,
        })),
    ];

    root.render(
        <NavigationContainer>
            <Breadcrumbs path={ entries } />
        </NavigationContainer>
    );
}
