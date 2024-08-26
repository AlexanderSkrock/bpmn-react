import React, { useCallback, useEffect, useRef, useState } from "react";

import type { EventBusEventCallback, ImportDoneEvent } from "bpmn-js/lib/BaseViewer";
import Viewer from "bpmn-js/lib/NavigatedViewer";

import type { BpmnChartProps, OverlayDefinition } from "./BpmnChart.types";
import { isOverlayDefinition, isOverlayDefinitionBuilder, isOverlayDefinitionsBuilder } from "./BpmnChart.types";


import { getCanvas, getElementRegistry, getOverlays} from "./serviceHelpers";

const BpmnChart: React.FC<BpmnChartProps> = ({ xml, overlays, onViewerInitialized, onLoadingSuccess, onLoadingError }: BpmnChartProps) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [bpmnViewer, setBpmnViewer] = useState<Viewer | undefined>();


    const initializeOverlays = useCallback(() => {
        if (!bpmnViewer) {
            return;
        }

        const overlayService = getOverlays(bpmnViewer);
        const elementRegistry = getElementRegistry(bpmnViewer);

        overlayService.clear();
        console.log("Removed all active overlays.");


        const overlayDefinitions: OverlayDefinition[] = [];

        const overlayBuilderEnvironment = {
            rootElement: () => getCanvas(bpmnViewer).getRootElement(),
            canvas: () => getCanvas(bpmnViewer),
        };

        overlays?.forEach(overlay => {
            if (isOverlayDefinition(overlay)) {
                overlayDefinitions.push(overlay);
            } else if (isOverlayDefinitionBuilder(overlay)) {
                const elementFilter = overlay.elementFilter;
                const elements = typeof elementFilter === 'string'
                    ? elementRegistry.filter(element => elementFilter === element.id)
                    : elementRegistry.filter(elementFilter);

                elements.forEach(element => {
                    const buildResult = overlay.buildDefinition(element, overlayBuilderEnvironment);
                    overlayDefinitions.push(buildResult);
                })
            } else if (isOverlayDefinitionsBuilder(overlay)) {
                const elements = overlay.elementFilter
                    ? elementRegistry.filter(overlay.elementFilter)
                    : elementRegistry.getAll();
                
                const buildResults = overlay.buildDefinitions(elements, overlayBuilderEnvironment);
                buildResults.forEach(overlayDefinition => {
                    overlayDefinitions.push(overlayDefinition);
                });
            }
        });

        overlayDefinitions.forEach(({ type, element, config }) => {
            if (type) {
                overlayService.add(element, type, config);
            } else {
                overlayService.add(element, config);
            }
        });
        console.log(`Registered ${overlayDefinitions.length} overlays.`);
    }, [bpmnViewer, overlays]);

    const handleImportDone: EventBusEventCallback<ImportDoneEvent> = useCallback((event: ImportDoneEvent) => {
        const { error, warnings } = event;

        if (error) {
          return onLoadingError?.(error);
        }

        initializeOverlays();

        if (bpmnViewer) {
            getCanvas(bpmnViewer).zoom('fit-viewport');
        }

        return onLoadingSuccess?.({ warnings });
    }, [bpmnViewer, initializeOverlays, onLoadingSuccess, onLoadingError]);

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
