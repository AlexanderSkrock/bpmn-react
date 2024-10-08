import Modeler from "bpmn-js/lib/Modeler";

import type { BaseViewerOptions } from "../Viewer/Viewer.types";
import useBpmnJsViewer from "./useBpmnJsModeler";

export default (options: BaseViewerOptions) => useBpmnJsViewer({
    factory: (factoryOptions: BaseViewerOptions) => new Modeler(factoryOptions),
    options,
});