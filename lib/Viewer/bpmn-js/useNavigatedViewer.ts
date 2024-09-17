import NavigatedViewer from "bpmn-js/lib/NavigatedViewer";

import type { BaseViewerOptions } from "./bpmn-js.types";
import useBpmnJsViewer from "./useBpmnJsViewer";

export default (options: BaseViewerOptions) => useBpmnJsViewer({
    factory: (factoryOptions: BaseViewerOptions) => new NavigatedViewer(factoryOptions),
    options,
});
