import type { DiagramLike } from "../../Diagram";

export interface ZoomControlRenderer {
    init: (options: ZoomControlInitOptions) => void;
    render: (props: ZoomControlRenderProps) => void;
}

export interface ZoomControlInitOptions {
    container: HTMLElement;
}

export interface ZoomControlRenderProps {
    diagram: DiagramLike;
}
