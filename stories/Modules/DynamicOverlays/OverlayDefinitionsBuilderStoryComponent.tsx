import React, { useEffect } from "react";

import CoreModule from "bpmn-js/lib/core";

import { useBaseViewer } from "../../../lib/Viewer";
import { ZoomModule } from "../../../lib/Modules/Zoom";
import { Overlay, DynamicOverlaysModule, ElementLike, OverlayBuilderEnvironment, useDynamicOverlays } from "../../../lib/Modules/DynamicOverlays";

const overlays: Overlay[] = [{
    elementFilter: () => true,
    buildDefinitions: (elements: ElementLike[], env: OverlayBuilderEnvironment) => {
      const htmlElement = document.createElement("div");
      htmlElement.style.width = env.canvas().viewbox().inner.width + "px";
      htmlElement.style.backgroundColor = "white";
      htmlElement.innerText = `This model contains a total of ${elements.length} elements.`;
  
      return [{
        element: env.rootElement().id,
        config: {
          position: {
              top: env.canvas().viewbox().inner.y,
              left: env.canvas().viewbox().inner.x,
          },
          html: htmlElement,
        }
      }];
    }
}];

const OverlayDefinitionsBuilderComponent = ({ xml }) => {
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

export default OverlayDefinitionsBuilderComponent;