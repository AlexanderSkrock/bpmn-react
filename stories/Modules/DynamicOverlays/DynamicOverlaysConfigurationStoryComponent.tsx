import React, { useEffect } from "react";

import CoreModule from "bpmn-js/lib/core";

import { useBaseViewer } from "../../../lib/Viewer";
import { DynamicOverlaysModule } from "../../../lib/Modules/DynamicOverlays";

const ViewerWithDynamicOverlaysModule = ({ xml }) => {
    const [handleViewerRef, viewer] = useBaseViewer({ additionalModules: [ CoreModule, DynamicOverlaysModule ] });

    useEffect(() => {
        if (xml) {
            viewer?.importXML(xml);
        }
    }, [viewer, xml])

    return <div ref={ handleViewerRef } />
}

export default ViewerWithDynamicOverlaysModule;
