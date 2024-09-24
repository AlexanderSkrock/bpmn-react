import React, { useEffect } from "react";

import CoreModule from "bpmn-js/lib/core";
import { is } from "bpmn-js/lib/util/ModelUtil";

import { useBaseViewer } from "../../../lib/Viewer";
import { ZoomModule } from "../../../lib/Modules/Zoom";
import { DynamicOverlaysModule, ElementLike, Overlay, useDynamicOverlays } from "../../../lib/Modules/DynamicOverlays";

const overlays: Overlay[] = [{
    elementFilter: (element: ElementLike) => is(element, "bpmn:userTask"),
    buildDefinition: (element: ElementLike) => {
        const htmlElement = document.createElement("div");
        htmlElement.style.width = `${element.width}px`;
        htmlElement.style.height = `${element.height}px`;
        htmlElement.title = element.id;

        return [{
            interactive: true,
            element: element.id,
            config: {
                position: {
                    bottom: -5,
                    right: -5,
                },
                html: element,
            }
        }]
    }
}];

const OverlayDefinitionBuilderComponent = ({ xml }) => {
    const [handleViewerRef, viewer] = useBaseViewer({
        additionalModules: [
            CoreModule,
            ZoomModule,
            DynamicOverlaysModule,
        ],
    });

    useDynamicOverlays(viewer, overlays);

    useEffect(() => {
        if (viewer && xml) {
            viewer.importXML(xml);
        }
    }, [viewer, xml])

    return <div ref={ handleViewerRef } />;
}

export default OverlayDefinitionBuilderComponent;