import type BaseModeler from "bpmn-js/lib/BaseModeler";
import type { BaseViewerOptions } from "bpmn-js/lib/BaseViewer";

export type { default as BaseModeler } from "bpmn-js/lib/BaseModeler";
export type { default as Modeler } from "bpmn-js/lib/Modeler";
export type { BaseViewerOptions } from "bpmn-js/lib/BaseViewer";

export interface UseBpmnJsModelerOptions<V extends BaseModeler, O extends BaseViewerOptions> {
    factory: (options: O) => V;
    options: O;
}

export type UseBpmnJsModelerResult<V extends BaseModeler> = [
    (viewerRef: HTMLElement | null) => void,
    V | null,
];