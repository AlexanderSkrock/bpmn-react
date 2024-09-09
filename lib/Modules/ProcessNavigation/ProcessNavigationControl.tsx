import React from "react";
import { Root } from "react-dom/client";
import styled from "styled-components";

import { Breadcrumbs } from "../../Components/Breadcrumbs";
import { ProcessNavigationControlProps } from "./ProcessNavigation.types";

const NavigationContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const renderProcessNavigation = (root: Root, { history, path, onHistoryClick, onPathClick }: ProcessNavigationControlProps) => {
    root.render(
        <NavigationContainer>
            <Breadcrumbs path={ history } onClick={ onHistoryClick } />
            <Breadcrumbs path={ path } onClick={ onPathClick } />
        </NavigationContainer>
    );
}
