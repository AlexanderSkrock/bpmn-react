import React from "react";
import { render } from "react-dom";

import { ZoomControlGroup, ZoomControlGroupProps } from "../../Control/Zoom";
import { ZoomControlRenderer } from "./Zoom.types";


export default class DefaultControlRenderer implements ZoomControlRenderer {

    container?: HTMLElement;

    init = (container: HTMLElement) => {
        container.style.position = "absolute";
        container.style.top = "0";
        container.style.right = "0";
        this.container = container;
    }

    render = (props: ZoomControlGroupProps) => {
        if (this.container) {
            render(<ZoomControlGroup {...props} />, this.container);
        }
    }
}
