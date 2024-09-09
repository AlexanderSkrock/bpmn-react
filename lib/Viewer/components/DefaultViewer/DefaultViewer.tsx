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

const DEFAULT_MODULES = [
    CoreModule,
    OverlaysModule,
    TranslateModule,
    MoveCanvasModule,
    SelectionModule,
    DynamicOverlaysModule,
    ZoomModule,
];

const withDefaultModules = (modules?: ModuleDeclaration[]) => {
    return modules ? [ ...DEFAULT_MODULES, ...modules ] : DEFAULT_MODULES;
}

const DefaultViewerContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export default ({ process, loadProcess, additionalModules, moddleExtensions, onViewerInitialized, onLoadingSuccess, onLoadingError, className }: DefaultViewerProps) => {
    const [currentProcessStack, setCurrentProcessStack] = useState<ModdleElement[]>([]);

    const [currentBusinessObjectStack, setCurrentBusinessObjectStack] = useState<ModdleElement[]>([]);

    const [currentProcess, setCurrentProcess] = useState<ProcessViewerProps>(process);
    useEffect(() => {
        // Fresh import => Reset navigation
        setCurrentProcessStack([]);
        setCurrentBusinessObjectStack([]);
        setCurrentProcess(process);
    }, [process, setCurrentProcess]);

    const [handleViewerRef, viewer] = useBaseViewer({
        additionalModules: withDefaultModules(additionalModules),
        moddleExtensions,
    });

    const currentPath = useMemo(() => currentProcessStack.map(processElement => ({
        key: processElement.id,
        name: processElement.name ?? processElement.id
    })), [currentProcessStack]);

    const currentInternalPath = useMemo(() => currentBusinessObjectStack.flatMap(businessObject => {
        if (!viewer) {
            return [];
        }

        const canvas = getCanvas(viewer);
        const elementRegistry = getElementRegistry(viewer);

        let parentPlane = canvas.findRoot(getPlaneIdFromShape(businessObject)) || canvas.findRoot(businessObject.id);
        if (!parentPlane && isType(parent, "bpmn:Process")) {
          const participant = elementRegistry.find(element => {
            const businessObject = getBusinessObject(element);
            return businessObject && businessObject.get("processRef") === businessObject;
          });

          parentPlane = participant && canvas.findRoot(participant.id);
        }

        return parentPlane ? [{ key: businessObject.id, name: businessObject.name ?? businessObject.id  }] : [];
    }), [viewer, currentBusinessObjectStack]);

    const handleNavigationEntryClicked = useCallback((nextPath: PathEntry) => {
        const indexInPath = currentPath.findIndex(entry => entry.key === nextPath.key)

        if (indexInPath + 1 >= currentPath.length) {
            const topLevelBusinessObject = currentBusinessObjectStack.slice(-1)[0];

            const reverseParents = [];
            for (let element = topLevelBusinessObject; element; element = element.$parent) {
              if (isAnyType(element, ["bpmn:SubProcess", "bpmn:Process"])) {
                reverseParents.push(element);
              }
            }

            const rootBusinessObject = reverseParents.slice(-1)[0];
            if (viewer) {
                const nextRoot = getCanvas(viewer).findRoot(getPlaneIdFromShape(rootBusinessObject));
                if (nextRoot) {
                    getCanvas(viewer).setRootElement(nextRoot);
                }
            }
        } else if (indexInPath === 0) {
            setCurrentProcessStack([]);
            setCurrentBusinessObjectStack([]);
            setCurrentProcess(process);
        } else {
            const nextProcess = currentProcessStack[indexInPath];
            loadProcess?.({ calledElement: nextProcess.id }).then(loadedProcess => {
                setCurrentProcessStack(currentStack => currentStack.slice(0, indexInPath));
                setCurrentBusinessObjectStack([]);
                setCurrentProcess(loadedProcess);
            });
        }
    }, [viewer, currentPath, currentProcessStack, currentBusinessObjectStack, setCurrentProcessStack, setCurrentBusinessObjectStack, setCurrentProcess, loadProcess]);

    const handleInternalNavigationEntryClicked = useCallback((nextPath: PathEntry) => {
        const indexInPath = currentInternalPath.findIndex(entry => entry.key === nextPath.key)
        const nextBusinessObject = currentBusinessObjectStack[indexInPath];

        if (!viewer) {
            return;
        }

        const canvas = getCanvas(viewer);
        const elementRegistry = getElementRegistry(viewer);

        let parentPlane = canvas.findRoot(getPlaneIdFromShape(nextBusinessObject)) || canvas.findRoot(nextBusinessObject.id);
        if (!parentPlane && isType(nextBusinessObject, "bpmn:Process")) {
          const participant = elementRegistry.find(element => {
            const businessObject = getBusinessObject(element);
            return businessObject && businessObject.get('processRef') === businessObject;
          });

          parentPlane = participant && canvas.findRoot(participant.id);
        }

        if (parentPlane) {
            canvas.setRootElement(parentPlane);
        }
    }, [viewer, currentInternalPath, currentBusinessObjectStack]);

    useEffect(() => {
        if (viewer) {
            onViewerInitialized?.(viewer);
        }
    }, [viewer, onViewerInitialized]);

    const currentOverlays: any[] = useMemo(() => {
        return currentProcess?.overlays || [];
    }, [currentProcess?.overlays]);
    useOverlays(viewer, currentOverlays);

    const handleRootSet: EventBusEventCallback<any> = useCallback(event => {
        const businessObject = getBusinessObject(event.element);

        const reverseParents = [];

        for (let element = businessObject; element; element = element.$parent) {
          if (isAnyType(element, ["bpmn:SubProcess", "bpmn:Process"])) {
            reverseParents.push(element);
          }
        }

        const parents = reverseParents.reverse();
        const parentsWithoutRoot = parents.slice(1);

        setCurrentBusinessObjectStack(parentsWithoutRoot);
    }, [setCurrentBusinessObjectStack]);

    useEventHandler(viewer, "root.set", handleRootSet);

    const handleElementChanged: EventBusEventCallback<any> = useCallback(event => {
        const shape = event.element;
        const businessObject = getBusinessObject(shape);

        var isPresent = currentBusinessObjectStack.find(element => {
          return element === businessObject;
        });

        if (isPresent) {
            // Force recalculation
            setCurrentBusinessObjectStack(currentStack => [...currentStack]);

            // TODO change process stack as well, the top most item can also change in id or name
        }
    }, [setCurrentBusinessObjectStack]);

    useEventHandler(viewer, "element.changed", handleElementChanged);

    const handleParseComplete: EventBusEventCallback<ImportParseCompleteEvent> = useCallback((event: ImportParseCompleteEvent) => {
        let processElement = event.definitions?.rootElements?.filter((element: ModdleElement) => isType(element, "bpmn:Process"))?.[0];
        if (processElement) {
            setCurrentProcessStack(currentStack => [...currentStack, processElement]);
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
        if (!isType(element, "bpmn:CallActivity")) {
            return;
        }
        const businessElement = getBusinessObject(element);
        loadProcess?.(businessElement).then(calledProcess => {
            setCurrentProcess(calledProcess);
        });
    }, [loadProcess, setCurrentProcess]);

    useEventHandler(viewer, "element.click", handleCallActivityClicked);

    const handleSubprocessClicked: EventBusEventCallback<any> = useCallback(({ element }: any) => {
        if (!viewer || !isType(element, "bpmn:SubProcess")) {
            return;
        }
        const nextRoot = getCanvas(viewer).findRoot(getPlaneIdFromShape(element));
        if (nextRoot) {
            getCanvas(viewer).setRootElement(nextRoot);
        }
    }, [viewer, loadProcess, setCurrentProcess]);

    useEventHandler(viewer, "element.click", handleSubprocessClicked);

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
