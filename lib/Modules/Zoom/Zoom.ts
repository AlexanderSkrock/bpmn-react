import EventBus from "diagram-js/lib/core/EventBus";
import Canvas from "diagram-js/lib/core/Canvas";

import type { ZoomService } from "./Zoom.types";
import { renderZoomControl } from "./ZoomControl";

export default class Zoom implements ZoomService {

    static $inject = [
        "canvas",
        "eventBus",
    ];

    constructor(canvas: Canvas, eventBus: EventBus) {
        const zoomContainer = document.createElement("div");
        zoomContainer.style.position = "absolute";
        zoomContainer.style.top = "0";
        zoomContainer.style.right = "0";
        canvas.getContainer().appendChild(zoomContainer);

        renderZoomControl(zoomContainer, {
            diagramLike:  { canvas, eventBus },
            direction: "vertical",
            options: {
                initialFit: true,
            },
        });
    }
}
