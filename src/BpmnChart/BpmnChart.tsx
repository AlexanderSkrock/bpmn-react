import React, { useCallback, useEffect, useRef, useState } from "react";

import type { EventBusEventCallback, ImportDoneEvent } from "bpmn-js/lib/BaseViewer";
import Viewer from "bpmn-js/lib/Viewer";

import type { BpmnChartProps } from "./BpmnChart.types";
import { getCanvas } from "./serviceHelpers";

const BpmnChart: React.FC<BpmnChartProps> = ({ xml, onLoadingSuccess, onLoadingError }: BpmnChartProps) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [bpmnViewer, setBpmnViewer] = useState<Viewer | undefined>();

    const handleImportDone: EventBusEventCallback<ImportDoneEvent> = useCallback((event: ImportDoneEvent) => {
        const { error, warnings } = event;
      
        if (error) {
          return onLoadingError?.(error);
        }

        getCanvas(bpmnViewer)?.zoom('fit-viewport');
  
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
        if (!bpmnViewer) {
            return;
        }

        bpmnViewer.off('import.done');
        bpmnViewer.on('import.done', handleImportDone);
    }, [bpmnViewer, handleImportDone]);

    useEffect(() => {
        bpmnViewer?.importXML(xml);
    }, [bpmnViewer, xml])

    return (
        <div data-testid="bpmnChart" ref={ chartContainerRef } />
    );
};

export default BpmnChart;