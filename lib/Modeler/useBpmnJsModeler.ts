import { BaseModeler, BaseViewerOptions, UseBpmnJsModelerOptions, UseBpmnJsModelerResult } from "./Modeler.types";
import { useBpmnJsViewer } from "../Viewer";

export default <V extends BaseModeler, O extends BaseViewerOptions>({ factory, options }: UseBpmnJsModelerOptions<V, O>): UseBpmnJsModelerResult<V> => {
    const [handleRef, modeler] = useBpmnJsViewer<V, O>({
        factory,
        options
    })

    return [handleRef, modeler];
};
