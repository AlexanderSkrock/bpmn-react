import { useCallback, useEffect, useState } from "react";

import { BaseModeler, BaseViewerOptions, UseBpmnJsModelerOptions, UseBpmnJsModelerResult } from "./Modeler.types";

export default <V extends BaseModeler, O extends BaseViewerOptions>({ factory, options }: UseBpmnJsModelerOptions<V, O>): UseBpmnJsModelerResult<V> => {
    const [modeler, setModeler] = useState<V | null>(null);

    const handleRef = useCallback((ref: HTMLElement | null) => {
        if (modeler) {
            if (ref) {
                modeler.attachTo(ref)
            } else {
                modeler.detach();
            }
        } else if (ref) {
            setModeler(factory({
                ...options,
                container: ref,
            }));
        }
    }, [modeler, setModeler]);

    useEffect(() => () => modeler?.destroy(), []);

    return [handleRef, modeler];
};
