import React, { useCallback, useEffect, useState } from "react";

import styled from "styled-components";

import OverlaysModule from "diagram-js/lib/features/overlays";
import SelectionModule from "diagram-js/lib/features/selection";
import TranslateModule from "diagram-js/lib/i18n/translate";
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import CoreModule from "bpmn-js/lib/core";
import type { ModdleElement, EventBusEventCallback, ImportDoneEvent } from "bpmn-js/lib/BaseViewer";

import type { DefaultViewerProps, ModuleDeclaration, Overlays } from "./DefaultViewer.types";
import { useBaseViewer, useEventHandler } from "../../hooks";
import useOverlays from "./useOverlays";
import { DynamicOverlaysModule } from "../../../Modules/DynamicOverlays";
import { ZoomModule } from "../../../Modules/Zoom";
import { CalledElementLoader, CalledElementLoadResult, ProcessNavigationModule} from "../../../Modules/ProcessNavigation";

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

export default ({ xml, overlays = [], loadCalledElement, additionalModules, moddleExtensions, onViewerInitialized, onLoadingSuccess, onLoadingError, className }: DefaultViewerProps) => {
    const [currentOverlays, setCurrentOverlays] = useState<Overlays>(overlays);
    
    const handleLoadCalledElement = useCallback((calledElement: ModdleElement) => {
        return loadCalledElement(calledElement).then(result => {
            setCurrentOverlays(result.overlays || []);
            return result;
        })
    }, [loadCalledElement, setCurrentOverlays]);

    const [handleViewerRef, viewer] = useBaseViewer({
        additionalModules: withLoaderModule(handleLoadCalledElement, withDefaultModules(additionalModules)),
        moddleExtensions,
    });

    useEffect(() => {
        if (viewer) {
            onViewerInitialized?.(viewer);
        }
    }, [viewer, onViewerInitialized]);

    useOverlays(viewer, currentOverlays);

    const handleImportDone: EventBusEventCallback<ImportDoneEvent> = useCallback((event: ImportDoneEvent) => {
        const { error, warnings } = event;

        if (error) {
          return onLoadingError?.(error);
        }

        return onLoadingSuccess?.({ warnings });
    }, [onLoadingSuccess, onLoadingError]);

    useEventHandler(viewer, "import.done", handleImportDone);

    useEffect(() => {
        if (viewer && xml) {
            viewer.importXML(xml);
        }
    }, [viewer, xml])

    // @ts-ignore
    return (
        <DefaultViewerContainer>
            <div data-testid="bpmnViewer" ref={ handleViewerRef } className={ className } />
        </DefaultViewerContainer>
    );
}
