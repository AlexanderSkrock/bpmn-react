import { ContourMultiPolygon, create, geoIdentity, geoPath, Selection } from "d3";
import { Renderer, RendererInitOptions, RendererRenderOptions } from "./Heatmap.types";

export default class SvgRenderer implements Renderer {

    svgSelection?: Selection<SVGSVGElement, undefined, null, undefined>;

    init = ({ width, height }: RendererInitOptions) => {
        this.svgSelection = create("svg").attr("width", `${width}px`).attr("height", `${height}px`);
    }

    render = (contour: ContourMultiPolygon, { color, opacity }: RendererRenderOptions) => {
        if (!this.svgSelection) {
            throw new Error("unable to render before calling init");
        }
        const path = geoPath().projection(geoIdentity().scale(1));

        this.svgSelection
            .append("g")
            .append("path")
            .attr("d", path(contour))
            .attr("fill", color)
            .attr("fill-opacity", opacity);
    };

    element = (): HTMLElement => {
        const node = this.svgSelection?.node();
        if (!node) {
            throw new Error("unable to retrieve the element before calling init");
        }
        return node as unknown as HTMLElement;
    };
}
