import { ContourMultiPolygon, create, geoIdentity, geoPath } from "d3";
import { Renderer, RendererInitOptions, RendererRenderOptions } from "./Heatmap.types";

export default class CanvasRenderer implements Renderer {

    canvas?: HTMLCanvasElement;
    renderContext?: CanvasRenderingContext2D;

    init = ({ width, height }: RendererInitOptions) => {
        this.canvas = create("canvas").attr("width", `${width}px`).attr("height", `${height}px`).node() as HTMLCanvasElement;
        this.renderContext = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    }

    render = (contour: ContourMultiPolygon, { color, opacity }: RendererRenderOptions) => {
        if (!this.renderContext) {
            throw new Error("unable to render before calling init");
        }

        this.renderContext.globalAlpha = opacity;
        this.renderContext.fillStyle = color;

        this.renderContext.beginPath();

        const path = geoPath().projection(geoIdentity().scale(1)).context(this.renderContext);
        path(contour)
        this.renderContext.fill();

        this.renderContext.closePath();
    };

    element = (): HTMLElement => {
        if (!this.canvas) {
            throw new Error("unable to retrieve the element before calling init");
        }
        return this.canvas;
    };
}
