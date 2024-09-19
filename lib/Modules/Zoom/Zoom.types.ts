import type { DiagramLike } from "../../util/services";

export interface ZoomControlRenderer {
    init: (container: HTMLElement) => void;
    render: (props: ZoomControlRendererProps) => void;
}

export interface ZoomControlRendererProps {
    diagramLike: DiagramLike;
}
