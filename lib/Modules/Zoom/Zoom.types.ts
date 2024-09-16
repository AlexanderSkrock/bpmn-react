import type { ZoomControlGroupProps } from "../../Control/Zoom";

export interface ZoomControlRenderer {
    init: (container: HTMLElement) => void;
    render: (props: ZoomControlGroupProps) => void;
}
