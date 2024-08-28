import React, { useCallback, useEffect, useRef } from "react";

import styled from "styled-components";

import type { EventBusEventCallback, ImportDoneEvent } from "bpmn-js/lib/BaseViewer";

import type { BpmnChartProps } from "./BpmnViewer.types";
import { getCanvas } from "./serviceHelpers";
import useOverlays from "./useOverlays";
import useViewer from "./useViewer";
import useEventHandler from "./useEventHandler";

const BpmnViewerContainer = styled.div`
  .djs-overlay:has(.non-interactive) {
    pointer-events: none;
  }
`;

const BpmnViewer: React.FC<BpmnChartProps> = ({ xml, overlays, modules, onViewerInitialized, onLoadingSuccess, onLoadingError }: BpmnChartProps) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const bpmnViewer = useViewer(chartContainerRef, {
        modules,
    });

    useEffect(() => {
        if (bpmnViewer) {
            onViewerInitialized?.(bpmnViewer);
        }
    }, [bpmnViewer, onViewerInitialized]);

    useOverlays(bpmnViewer, overlays);

    const handleImportDone: EventBusEventCallback<ImportDoneEvent> = useCallback((event: ImportDoneEvent) => {
        const { error, warnings } = event;

        if (error) {
          return onLoadingError?.(error);
        }

        if (bpmnViewer) {
            getCanvas(bpmnViewer).zoom('fit-viewport');
        }

        return onLoadingSuccess?.({ warnings });
    }, [bpmnViewer, onLoadingSuccess, onLoadingError]);

    useEventHandler(bpmnViewer, "import.done", handleImportDone);

    useEffect(() => {
        bpmnViewer?.importXML(xml);
    }, [bpmnViewer, xml])

    return (
        <BpmnViewerContainer data-testid="bpmnChart" ref={ chartContainerRef } />
    );
};

export default BpmnViewer;
