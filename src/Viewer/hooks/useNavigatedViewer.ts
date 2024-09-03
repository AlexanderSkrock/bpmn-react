import type { BaseViewerOptions } from "bpmn-js/lib/BaseViewer";

import NavigatedViewer from "bpmn-js/lib/NavigatedViewer";

import useBpmnJsViewer from "./useBpmnJsViewer";

export default (options: BaseViewerOptions) => useBpmnJsViewer({
    factory: (options) => new NavigatedViewer(options),
    options,
});
