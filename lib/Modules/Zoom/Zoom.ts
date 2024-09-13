import EventBus from "diagram-js/lib/core/EventBus";
import Canvas from "diagram-js/lib/core/Canvas";

import type { ZoomControlRenderer, ZoomService } from "./Zoom.types";
import DefaultControlRenderer from "./defaultControlRenderer";

export default class Zoom implements ZoomService {

    static $inject = [
        "canvas",
        "eventBus",
    ];

    zoomControlRenderer: ZoomControlRenderer;

    constructor(canvas: Canvas, eventBus: EventBus) {
        // we could make this injectable in the future
        this.zoomControlRenderer = new DefaultControlRenderer();

        const zoomContainer = document.createElement("div");
        canvas.getContainer().appendChild(zoomContainer);
        this.zoomControlRenderer.init(zoomContainer);

        this.zoomControlRenderer.render({
            diagramLike:  { canvas, eventBus },
            direction: "vertical",
            options: {
                initialFit: true,
            },
        });
    }
}
