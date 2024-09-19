import React from "react";
import { render } from "react-dom";
import styled from "styled-components";

import {
    ProcessNavigationControlProps,
    ProcessNavigationControlRenderer
} from "./ProcessNavigation.types";
import { breadcrumbClassName, Breadcrumbs } from "../../Components/Breadcrumbs";
import { insertAt } from "../../util/html";

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

export default class DefaultControlRenderer implements ProcessNavigationControlRenderer {

    controlContainer?: HTMLElement;

    init = (container: HTMLElement) => {
        this.controlContainer = document.createElement("div");
        this.controlContainer.style.padding = "8px";
        
        insertAt(container, 0, this.controlContainer);
    }

    render = ({ history, path, onHistoryClick, onPathClick }: ProcessNavigationControlProps) => {
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

        if (this.controlContainer) {
            render(
                <NavigationContainer>
                    <Breadcrumbs path={ entries } />
                </NavigationContainer>,
                this.controlContainer
            );
        }
    }
}
