import { useCallback, useEffect, useState } from "react";

import type BaseViewer from "bpmn-js/lib/BaseViewer";
import type { BaseViewerOptions } from "bpmn-js/lib/BaseViewer";

import { UseBpmnJsViewerOptions, UseBpmnJsViewerResult } from "./Viewer.types";

export default <V extends BaseViewer, O extends BaseViewerOptions>({ factory, options }: UseBpmnJsViewerOptions<V, O>): UseBpmnJsViewerResult<V> => {
    const [viewer, setViewer] = useState<V | null>(null);

    const handleRef = useCallback((ref: HTMLElement | null) => {
        if (viewer) {
            if (ref) {
                viewer.attachTo(ref)
            } else {
                viewer.detach();
            }
        } else if (ref) {
            setViewer(factory({
                ...options,
                container: ref,
            }));
        }
    }, [viewer, setViewer]);

    useEffect(() => () => viewer?.destroy(), []);

    return [handleRef, viewer];
};
