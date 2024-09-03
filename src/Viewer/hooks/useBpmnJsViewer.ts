import { useCallback, useEffect, useState } from "react";

import type BaseViewer from "bpmn-js/lib/BaseViewer";
import type { BaseViewerOptions } from "bpmn-js/lib/BaseViewer";
import { UseBpmnJsViewerOptions, UseBpmnJsViewerResult } from './hooks.types';

export default <V extends BaseViewer, O extends BaseViewerOptions>({ factory, options }: UseBpmnJsViewerOptions<V, O>): UseBpmnJsViewerResult<V, O> => {
    const [viewer, setViewer] = useState<V | null>(null);

    const handleRef = useCallback((ref: any) => {
        if (viewer) {
            if (ref) {
                viewer.attachTo(ref)
            } else {
                viewer.detach();
            }
        } else if (ref) {
            setViewer(factory({
                ...options,
                container: ref.current,
            }));
        }
    }, [viewer, setViewer]);

    useEffect(() => () => viewer?.destroy(), []);

    return [handleRef, viewer];
};
