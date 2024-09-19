import EventBus from "diagram-js/lib/core/EventBus";
import Canvas from "diagram-js/lib/core/Canvas";

import type { ZoomControlRenderer } from "./Zoom.types";

export default class Zoom {

    static $inject = [
        "canvas",
        "eventBus",
        "zoomControlRenderer",
    ];

    constructor(canvas: Canvas, eventBus: EventBus, controlRenderer: ZoomControlRenderer) {
        controlRenderer.init({ container: canvas.getContainer() });

        controlRenderer.render({
            diagramLike:  { canvas, eventBus },
        });
    }
}
