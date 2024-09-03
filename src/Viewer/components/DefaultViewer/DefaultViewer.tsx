import React, { useCallback, useEffect, useState } from "react";

import styled from "styled-components";

import OverlaysModule from "diagram-js/lib/features/overlays";
import SelectionModule from "diagram-js/lib/features/selection";
import TranslateModule from "diagram-js/lib/i18n/translate";
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import CoreModule from "bpmn-js/lib/core";

import type { DefaultViewerProps, ModuleDeclaration } from "./DefaultViewer.types";
import type { EventBusEventCallback, ImportDoneEvent } from "bpmn-js/lib/BaseViewer";

import { useBaseViewer, useEventHandler } from "../../hooks";
import useOverlays from "./useOverlays";
import { getCanvas } from "../../../util/services";
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";

const DEFAULT_MODULES = [
    CoreModule,
    OverlaysModule,
    TranslateModule,
    MoveCanvasModule,
    SelectionModule,
];

const withDefaultModules = (modules?: ModuleDeclaration[]) => {
    return modules ? [ ...DEFAULT_MODULES, ...modules ] : DEFAULT_MODULES;
}

const ViewerContainer = styled.div`
    .djs-overlay:has(.non-interactive) {
        pointer-events: none;
    }
`;

export default ({ process, loadProcess, additionalModules, moddleExtensions, onViewerInitialized, onLoadingSuccess, onLoadingError, className }: DefaultViewerProps) => {
    const [currentProcess, setCurrentProcess] = useState(process);
    useEffect(() => {
        setCurrentProcess(process);
    }, [process, setCurrentProcess]);

    const [handleViewerRef, viewer] = useBaseViewer({
        additionalModules: withDefaultModules(additionalModules),
        moddleExtensions,
    });

    useEffect(() => {
        if (viewer) {
            onViewerInitialized?.(viewer);
        }
    }, [viewer, onViewerInitialized]);

    useOverlays(viewer, currentProcess?.overlays);

    const handleImportDone: EventBusEventCallback<ImportDoneEvent> = useCallback((event: ImportDoneEvent) => {
        const { error, warnings } = event;

        if (error) {
          return onLoadingError?.(error);
        }

        if (viewer) {
            getCanvas(viewer).zoom('fit-viewport');
        }

        return onLoadingSuccess?.({ warnings });
    }, [viewer, onLoadingSuccess, onLoadingError]);

    useEventHandler(viewer, "import.done", handleImportDone);

    const handleCallActivityClicked: EventBusEventCallback<any> = useCallback(({ element }: any) => {
        if (element.type !== "bpmn:CallActivity") {
            return;
        }

        const businessElement = getBusinessObject(element);
        loadProcess?.(businessElement).then(calledProcess => {
            setCurrentProcess(calledProcess);
        });
    }, [loadProcess, setCurrentProcess]);

    useEventHandler(viewer, "element.click", handleCallActivityClicked);

    useEffect(() => {
        if (currentProcess && currentProcess.xml) {
            viewer?.importXML(currentProcess.xml);
        }
    }, [viewer, currentProcess])

    // @ts-ignore
    return <ViewerContainer data-testid="bpmnViewer" ref={ handleViewerRef } className={ className } />;
}