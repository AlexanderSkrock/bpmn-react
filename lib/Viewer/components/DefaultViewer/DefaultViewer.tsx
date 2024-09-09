import React, { useCallback, useEffect, useMemo, useState } from "react";

import styled from "styled-components";

import OverlaysModule from "diagram-js/lib/features/overlays";
import SelectionModule from "diagram-js/lib/features/selection";
import TranslateModule from "diagram-js/lib/i18n/translate";
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import CoreModule from "bpmn-js/lib/core";
import { getPlaneIdFromShape } from "bpmn-js/lib/util/DrilldownUtil";
import { is as isType, isAny as isAnyType, getBusinessObject } from "bpmn-js/lib/util/ModelUtil"

import type { DefaultViewerProps, ModuleDeclaration, ProcessViewerProps } from "./DefaultViewer.types";
import { ModdleElement, type EventBusEventCallback, type ImportDoneEvent, type ImportParseCompleteEvent } from "bpmn-js/lib/BaseViewer";

import { useBaseViewer, useEventHandler } from "../../hooks";
import useOverlays from "./useOverlays";
import { getCanvas, getElementRegistry } from "../../../util/services";
import { Breadcrumbs } from "../../../Components/Breadcrumbs";
import type { PathEntry } from '../../../Components/Breadcrumbs';
import { DynamicOverlaysModule } from "../../../Modules/DynamicOverlays";
import { ZoomModule } from "../../../Modules/Zoom";
import {
    CalledElementLoader, CalledElementLoadResult,
    ProcessNavigationModule
} from "../../../Modules/ProcessNavigation";

const DEFAULT_MODULES = [
    CoreModule,
    OverlaysModule,
    TranslateModule,
    MoveCanvasModule,
    SelectionModule,
    DynamicOverlaysModule,
    ZoomModule,
    ProcessNavigationModule,
];

const withDefaultModules = (modules?: ModuleDeclaration[]) => {
    return modules ? [ ...DEFAULT_MODULES, ...modules ] : DEFAULT_MODULES;
}

const withLoaderModule = (loader: (element: ModdleElement) => Promise<CalledElementLoadResult>, modules?: ModuleDeclaration[]) => {
    const LoaderModule: ModuleDeclaration = {
        calledElementLoader: [
            "type",
            class CalledElementLoaderImpl implements CalledElementLoader {

                load = (element: ModdleElement) => {
                    return loader(element);
                }
            }
        ],
    };
    return modules ? [ ...modules, LoaderModule ] : [ LoaderModule ];
}

const DefaultViewerContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export default ({ process, loadProcess, additionalModules, moddleExtensions, onViewerInitialized, onLoadingSuccess, onLoadingError, className }: DefaultViewerProps) => {
    const [currentProcess, setCurrentProcess] = useState<ProcessViewerProps>(process);
    useEffect(() => {
        setCurrentProcess(process);
    }, [process, setCurrentProcess]);

    const loadCalledElements = useCallback((calledElement: ModdleElement) => {
        loadProcess(calledElement).then(processViewerResult => {
            setCurrentProcess()
        })
    }, [loadProcess])

    const [handleViewerRef, viewer] = useBaseViewer({
        additionalModules: withLoaderModule(loadProcess, withDefaultModules(additionalModules)),
        moddleExtensions,
    });

    useEffect(() => {
        if (viewer) {
            onViewerInitialized?.(viewer);
        }
    }, [viewer, onViewerInitialized]);

    const currentOverlays: any[] = useMemo(() => {
        return currentProcess?.overlays || [];
    }, [currentProcess?.overlays]);
    useOverlays(viewer, currentOverlays);

    const handleImportDone: EventBusEventCallback<ImportDoneEvent> = useCallback((event: ImportDoneEvent) => {
        const { error, warnings } = event;

        if (error) {
          return onLoadingError?.(error);
        }

        return onLoadingSuccess?.({ warnings });
    }, [viewer, onLoadingSuccess, onLoadingError]);

    useEventHandler(viewer, "import.done", handleImportDone);

    useEffect(() => {
        if (currentProcess && currentProcess.xml) {
            viewer?.importXML(currentProcess.xml);
        }
    }, [viewer, currentProcess])

    // @ts-ignore
    return (
        <DefaultViewerContainer>
            <Breadcrumbs path={ currentPath } onClick={ handleNavigationEntryClicked } />
            <Breadcrumbs path={ currentInternalPath } onClick={ handleInternalNavigationEntryClicked } />
            <div data-testid="bpmnViewer" ref={ handleViewerRef } className={ className } />
        </DefaultViewerContainer>
    );
}
