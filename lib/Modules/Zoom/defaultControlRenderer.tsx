import React from "react";
import { render } from "react-dom";

import { ZoomControlGroup } from "../../Control/Zoom";
import type { ZoomControlInitOptions, ZoomControlRenderer, ZoomControlRenderProps } from "./Zoom.types";


export default class DefaultControlRenderer implements ZoomControlRenderer {

    controlContainer?: HTMLElement;

    init = ({ container }: ZoomControlInitOptions) => {
        this.controlContainer = document.createElement("div");
        this.controlContainer.style.position = "absolute";
        this.controlContainer.style.top = "0";
        this.controlContainer.style.right = "0";
        
        container.appendChild(this.controlContainer);
    }

    render = ({ diagramLike }: ZoomControlRenderProps) => {
        if (this.controlContainer) {
            render(
                <ZoomControlGroup diagramLike={ diagramLike } direction="vertical" options={ { initialFit: true } } />,
                this.controlContainer
            );
        }
    }
}