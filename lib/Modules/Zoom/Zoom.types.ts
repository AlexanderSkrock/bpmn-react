import type { DiagramLike } from "../../util/services";

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
