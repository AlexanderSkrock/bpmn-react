import type BaseViewer from "bpmn-js/lib/BaseViewer";
import type { BaseViewerOptions } from "bpmn-js/lib/BaseViewer";

export type { default as BaseViewer } from "bpmn-js/lib/BaseViewer";
export type { default as Viewer } from "bpmn-js/lib/Viewer";
export type { default as NavigatedViewer } from "bpmn-js/lib/NavigatedViewer";
export type { BaseViewerOptions } from "bpmn-js/lib/BaseViewer";

export type { EventBusEventCallback } from 'bpmn-js/lib/BaseViewer';

export interface UseBpmnJsViewerOptions<V extends BaseViewer, O extends BaseViewerOptions> {
    factory: (options: O) => V;
    options: O;
}

export type UseBpmnJsViewerResult<V extends BaseViewer> = [
    (viewerRef: HTMLElement) => void,
    V | null,
];
