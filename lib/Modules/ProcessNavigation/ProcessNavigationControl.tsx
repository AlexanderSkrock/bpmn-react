import React from "react";
import { Root } from "react-dom/client";

import { Breadcrumbs } from "../../Components/Breadcrumbs";
import { ProcessNavigationControlProps } from "./ProcessNavigation.types";

export const renderProcessNavigation = (root: Root, { history, path, onHistoryClick, onPathClick }: ProcessNavigationControlProps) => {
    root.render(
        <>
            <Breadcrumbs path={ history } onClick={ onHistoryClick } />
            <Breadcrumbs path={ path } onClick={ onPathClick } />
        </>
    );
}
