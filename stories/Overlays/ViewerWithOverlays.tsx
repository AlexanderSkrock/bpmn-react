import React, { useCallback, useEffect, useState } from "react";

import MoveCanvasModule from "diagram-js/lib/navigation/movecanvas";
import { ModdleElement } from "bpmn-js/lib/model/Types";

import { useBaseViewer } from "../../lib/Viewer";
import { DynamicOverlaysModule, Overlay, useDynamicOverlays } from "../../lib/Modules/DynamicOverlays";
import { CalledElementLoader, ProcessNavigationModule } from "../../lib/Modules/ProcessNavigation";
import { ZoomModule } from "../../lib/Modules/Zoom";

const ViewerWithOverlays = ({
    xml,
    overlays,
    loadCalledElement
}: {
    xml: string,
    overlays: Overlay[],
    loadCalledElement: (calledElement: ModdleElement) => Promise<{ xml: string, overlays: Overlay[] }>
}) => {
    const [currentOverlays, setOverlays] = useState<Overlay[]>(overlays);
    const handleLoadCalledElement = useCallback((calledElement: ModdleElement) => {
        return loadCalledElement(calledElement).then(result => {
            setOverlays(result.overlays);
            return result;
        })
    }, [loadCalledElement, setOverlays]);

    const [handleViewerRef, viewer] = useBaseViewer({
        additionalModules: [
            MoveCanvasModule,
            ZoomModule,
            DynamicOverlaysModule,
            ProcessNavigationModule,
            {
                calledElementLoader: [
                    "type",
                    class CalledElementLoaderImpl implements CalledElementLoader {

                        load = (element: ModdleElement) => {
                            return handleLoadCalledElement(element);
                        }
                    }
                ],
            },
        ],
    });

    useDynamicOverlays(viewer, currentOverlays);

    useEffect(() => {
        if (viewer && xml) {
            viewer.importXML(xml);
        }
    }, [viewer, xml])

    return <div ref={ handleViewerRef } />;
}

export default ViewerWithOverlays;
