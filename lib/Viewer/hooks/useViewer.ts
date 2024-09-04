import type { BaseViewerOptions } from "bpmn-js/lib/BaseViewer";

import Viewer from "bpmn-js/lib/Viewer";

import useBpmnJsViewer from "./useBpmnJsViewer";

export default (options: BaseViewerOptions) => useBpmnJsViewer({
    factory: (options) => new Viewer(options),
    options,
});
