import React, { useCallback, useEffect, useRef, useState } from "react";

import type { EventBusEventCallback, ImportDoneEvent } from "bpmn-js/lib/BaseViewer";
import Viewer from "bpmn-js/lib/NavigatedViewer";

import type { BpmnChartProps } from "./BpmnChart.types";

import { getCanvas } from "./serviceHelpers";
import useOverlays from "./useOverlays";

const BpmnChart: React.FC<BpmnChartProps> = ({ xml, overlays, onViewerInitialized, onLoadingSuccess, onLoadingError }: BpmnChartProps) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [bpmnViewer, setBpmnViewer] = useState<Viewer | undefined>();

    useOverlays({ overlays, diagram: bpmnViewer });

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

    useEffect(() => {
        if (!bpmnViewer && chartContainerRef.current) {
            setBpmnViewer(new Viewer({
                container: chartContainerRef.current,
            }));
        }

        return () => bpmnViewer?.destroy();
    }, [chartContainerRef.current]);

    useEffect(() => {
        if (bpmnViewer) {
            onViewerInitialized?.(bpmnViewer);
        }
    }, [bpmnViewer, onViewerInitialized]);

    useEffect(() => {
        if (bpmnViewer) {
            bpmnViewer.on('import.done', handleImportDone);
        }
        return () => {
            if (bpmnViewer) {
                bpmnViewer.off('import.done', handleImportDone);
            }
        }
    }, [bpmnViewer, handleImportDone]);

    useEffect(() => {
        bpmnViewer?.importXML(xml);
    }, [bpmnViewer, xml])

    return (
        <div data-testid="bpmnChart" ref={ chartContainerRef } />
    );
};

export default BpmnChart;
