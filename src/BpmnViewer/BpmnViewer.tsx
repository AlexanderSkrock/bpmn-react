import React, {useCallback, useEffect, useRef, useState} from "react";

import styled from "styled-components";

import type { EventBusEventCallback, ImportDoneEvent } from "bpmn-js/lib/BaseViewer";

import type { BpmnViewerProps } from "./BpmnViewer.types";
import { getCanvas } from "./serviceHelpers";
import useOverlays from "./useOverlays";
import useViewer from "./useViewer";
import useEventHandler from "./useEventHandler";
import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";

const BpmnViewerContainer = styled.div`
  .djs-overlay:has(.non-interactive) {
    pointer-events: none;
  }
`;

const BpmnViewer: React.FC<BpmnViewerProps> = ({ process, loadProcess, modules, onViewerInitialized, onLoadingSuccess, onLoadingError }: BpmnViewerProps) => {
    const [calledElements, setCalledElements] = useState({});

    const [currentProcess, setCurrentProcess] = useState(process);
    useEffect(() => {
        setCurrentProcess(process);
        setCalledElements({})
    }, [process, setCurrentProcess]);


    const chartContainerRef = useRef<HTMLDivElement>(null);
    const bpmnViewer = useViewer(chartContainerRef, {
        modules,
    });

    useEffect(() => {
        if (bpmnViewer) {
            onViewerInitialized?.(bpmnViewer);
        }
    }, [bpmnViewer, onViewerInitialized]);

    useOverlays(bpmnViewer, currentProcess?.overlays);

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

    const handleCallActivityClicked = useCallback(({ element }) => {
        if (element.type !== "bpmn:CallActivity") {
            return;
        }
        if (calledElements[element.id]) {
            setCurrentProcess(calledElements[element.id]);
        } else {
            const businessElement = getBusinessObject(element);
            loadProcess(businessElement).then(calledProcess => {
                setCalledElements(curentCalledElements => ({ ...curentCalledElements, [element.id]: calledProcess, }))
                setCurrentProcess(calledProcess);
            });
        }
    }, [loadProcess, calledElements, setCalledElements, setCurrentProcess]);

    useEventHandler(bpmnViewer, "element.click", handleCallActivityClicked);

    useEffect(() => {
        if (currentProcess && currentProcess.xml) {
            bpmnViewer?.importXML(currentProcess.xml);
        }
    }, [bpmnViewer, currentProcess])

    return (
        <BpmnViewerContainer data-testid="bpmnChart" ref={ chartContainerRef } />
    );
};

export default BpmnViewer;
