import type { BaseViewerOptions } from "bpmn-js/lib/BaseViewer";

import BaseViewer from "bpmn-js/lib/BaseViewer";

import useBpmnJsViewer from "./useBpmnJsViewer";

export default (options: BaseViewerOptions) => useBpmnJsViewer({
    factory: (options) => new BaseViewer(options),
    options,
});