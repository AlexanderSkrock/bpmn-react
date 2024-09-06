import React, { useCallback, useEffect, useMemo, useState } from "react";

import styled from "styled-components";

import OverlaysModule from "diagram-js/lib/features/overlays";
import SelectionModule from "diagram-js/lib/features/selection";
import TranslateModule from "diagram-js/lib/i18n/translate";
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import CoreModule from "bpmn-js/lib/core";

import type { DefaultViewerProps, ModuleDeclaration, ProcessViewerProps } from "./DefaultViewer.types";
import type { EventBusEventCallback, ImportDoneEvent, ImportParseCompleteEvent } from "bpmn-js/lib/BaseViewer";

import { useBaseViewer, useEventHandler } from "../../hooks";
import useOverlays from "./useOverlays";
import { getCanvas } from "../../../util/services";
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";
import { Breadcrumbs, PathEntry } from "../../../Components/Breadcrumbs";
import { PathEntry } from '../../../Components/Breadcrumbs/Breadcrumb.types';

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

const DefaultViewerContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const ViewerContainer = styled.div`
    .djs-overlay:has(.non-interactive) {
        pointer-events: none;
    }
`;

export default ({ process, loadProcess, additionalModules, moddleExtensions, onViewerInitialized, onLoadingSuccess, onLoadingError, className }: DefaultViewerProps) => {
    const [currentProcessStack, setCurrentProcessStack] = useState<ProcessViewerProps[]>([]);
    const [currentPath, setCurrentPath] = useState<PathEntry[]>([]); 
    
    const [currentProcess, setCurrentProcess] = useState(process);
    useEffect(() => {
        // Fresh import => Reset navigation
        setCurrentProcessStack([process]);
        setCurrentPath([]);

        setCurrentProcess(process);
    }, [process, setCurrentProcess]);

    const handleNavigationEntryClicked = useCallback((nextPath: PathEntry) => {
        const indexInPath = currentPath.findIndex(entry => entry.key === nextPath.key)
        const nextProcess = currentProcessStack[indexInPath];

        if (currentPath.slice(-1)[0].key === nextPath.key) {
            return;
        }

        setCurrentProcessStack(currentStack => currentStack.slice(0, indexInPath + 1));
        setCurrentPath(currentPath => currentPath.slice(0, indexInPath));

        setCurrentProcess(nextProcess);
    }, [currentPath, currentProcessStack, setCurrentPath, setCurrentProcessStack]);

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

    const handleParseComplete: EventBusEventCallback<ImportParseCompleteEvent> = useCallback((event: ImportParseCompleteEvent) => {
        const processElement = event.definitions?.rootElements?.[0];
        if (processElement) {
            setCurrentPath(currentPath => ([
                ...currentPath,
                {
                    key: processElement.id,
                    name: processElement.name ?? processElement.id,
                }
            ]));
        }
    }, []);
    
    useEventHandler(viewer, "import.parse.complete", handleParseComplete);

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
            setCurrentProcessStack(currentStack => [...currentStack, calledProcess]);
        });
    }, [loadProcess, setCurrentProcess]);

    useEventHandler(viewer, "element.click", handleCallActivityClicked);

    useEffect(() => {
        if (currentProcess && currentProcess.xml) {
            viewer?.importXML(currentProcess.xml);
        }
    }, [viewer, currentProcess])

    // @ts-ignore
    return (
        <DefaultViewerContainer>
            <Breadcrumbs path={ currentPath } onClick={ handleNavigationEntryClicked } />
            <ViewerContainer data-testid="bpmnViewer" ref={ handleViewerRef } className={ className } />
        </DefaultViewerContainer>
    );
}