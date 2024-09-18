import Viewer from "bpmn-js/lib/Viewer";

import type { BaseViewerOptions } from "./Viewer.types";
import useBpmnJsViewer from "./useBpmnJsViewer";

export default (options: BaseViewerOptions) => useBpmnJsViewer({
    factory: (factoryOptions) => new Viewer(factoryOptions),
    options,
});
