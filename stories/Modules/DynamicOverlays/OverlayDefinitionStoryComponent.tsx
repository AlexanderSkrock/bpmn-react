import React, { useEffect } from 'react';

import CoreModule from 'bpmn-js/lib/core';

import { useBaseViewer } from '../../../lib/Viewer';
import { ZoomModule } from '../../../lib/Modules/Zoom';
import { DynamicOverlaysModule, useDynamicOverlays } from '../../../lib/Modules/DynamicOverlays';

const importantMarker = document.createElement("div");
importantMarker.innerText = "This activity is very important!";

const overlays = [{
    element: "Activity_12345",
    config: {
        position: {
            bottom: -5,
            right: -5,
        },
        html: importantMarker,
    },
}];

const OverlayDefinitionStoryComponent = ({ xml }) => {
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

export default OverlayDefinitionStoryComponent;