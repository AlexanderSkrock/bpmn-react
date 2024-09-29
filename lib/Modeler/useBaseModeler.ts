import BaseModeler from "bpmn-js/lib/BaseModeler";

import type { BaseViewerOptions } from "../Viewer/Viewer.types";
import useBpmnJsViewer from "./useBpmnJsModeler";

export default (options: BaseViewerOptions) => useBpmnJsViewer({
    factory: (factoryOptions: BaseViewerOptions) => new BaseModeler(factoryOptions),
    options,
});