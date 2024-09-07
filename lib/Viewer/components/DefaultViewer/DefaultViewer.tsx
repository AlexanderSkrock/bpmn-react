import React, { useCallback, useEffect, useMemo, useState } from "react";

import styled from "styled-components";

import OverlaysModule from "diagram-js/lib/features/overlays";
import SelectionModule from "diagram-js/lib/features/selection";
import TranslateModule from "diagram-js/lib/i18n/translate";
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import CoreModule from "bpmn-js/lib/core";
import { getBusinessObjectParentChain, getPlaneIdFromShape } from "bpmn-js/lib/util/DrilldownUtil";

import type { DefaultViewerProps, ModuleDeclaration, ProcessViewerProps } from "./DefaultViewer.types";
import type { EventBusEventCallback, ImportDoneEvent, ImportParseCompleteEvent } from "bpmn-js/lib/BaseViewer";

import { useBaseViewer, useEventHandler } from "../../hooks";
import useOverlays from "./useOverlays";
import { getCanvas, getElementRegistry } from "../../../util/services";
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";
import { Breadcrumbs } from "../../../Components/Breadcrumbs";
import type { PathEntry } from '../../../Components/Breadcrumbs/Breadcrumb.types';

function getBusinessObjectParentChain(child) {
    var businessObject = getBusinessObject(child);
  
    var parents = [];
  
    for (var element = businessObject; element; element = element.$parent) {
      if (element.$type === "bpmn:SubProcess" || element.$type === "bpmn:Process") {
        parents.push(element);
      }
    }
  
    return parents.reverse();
  }

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

    const [currentBusinessObjectStack, setCurrentBusinessObjectStack] = useState([]);

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

    const currentInternalPath = useMemo(() => currentBusinessObjectStack.flatMap(businessObject => {
        if (!viewer) {
            return [];
        }

        const canvas = getCanvas(viewer);
        const elementRegistry = getElementRegistry(viewer);

        let parentPlane = canvas.findRoot(getPlaneIdFromShape(businessObject)) || canvas.findRoot(businessObject.id);
        if (!parentPlane && parent.type === "bpmn:Process") {
          const participant = elementRegistry.find(element => {
            const businessObject = getBusinessObject(element);
            return businessObject && businessObject.get('processRef') === businessObject;
          });
  
          parentPlane = participant && canvas.findRoot(participant.id);
        }
  
        return parentPlane ? [{ key: businessObject.id, name: businessObject.name ?? businessObject.id  }] : [];
    }), [viewer, currentBusinessObjectStack]);

    const handleInternalNavigationEntryClicked = useCallback((nextPath: PathEntry) => {
        const indexInPath = currentInternalPath.findIndex(entry => entry.key === nextPath.key)
        const nextBusinessObject = currentBusinessObjectStack[indexInPath];

        const canvas = getCanvas(viewer);
        const elementRegistry = getElementRegistry(viewer);

        let parentPlane = canvas.findRoot(getPlaneIdFromShape(nextBusinessObject)) || canvas.findRoot(nextBusinessObject.id);
        if (!parentPlane && nextBusinessObject.type === "bpmn:Process") {
          const participant = elementRegistry.find(element => {
            const businessObject = getBusinessObject(element);
            return businessObject && businessObject.get('processRef') === businessObject;
          });
  
          parentPlane = participant && canvas.findRoot(participant.id);
        }

        if (viewer && parentPlane) {
            getCanvas(viewer).setRootElement(parentPlane);
        }
    }, [viewer, currentInternalPath, currentBusinessObjectStack]);

    useEffect(() => {
        if (viewer) {
            onViewerInitialized?.(viewer);
        }
    }, [viewer, onViewerInitialized]);

    useOverlays(viewer, currentProcess?.overlays);

    const handleRootSet = useCallback(event => {
        const businessObjectParents = getBusinessObjectParentChain(event.element);
        setCurrentBusinessObjectStack(businessObjectParents);
    }, [setCurrentBusinessObjectStack]);

    useEventHandler(viewer, "root.set", handleRootSet);

    const handleElementChanged = useCallback(event => {
        const shape = event.element;
        const businessObject = getBusinessObject(shape);
    
        var isPresent = businessObjectParents.find(element => {
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
        // TODO is $type really stable or is there a better way?
        // probably the is-function of bpmn-js or diagram-js
        // I should also have a look on all similar type checks
        let processElement = event.definitions?.rootElements?.filter(element => element.$type === "bpmn:Process")?.[0];
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
        if (element.type === "bpmn:CallActivity") {
            const businessElement = getBusinessObject(element);
            loadProcess?.(businessElement).then(calledProcess => {
                setCurrentProcess(calledProcess);
                setCurrentProcessStack(currentStack => [...currentStack, calledProcess]);
            });
        } else if (element.type === "bpmn:SubProcess") {
            if (viewer) {
                const nextRoot = getCanvas(viewer).findRoot(getPlaneIdFromShape(element));
                if (nextRoot) {
                    getCanvas(viewer).setRootElement(nextRoot);
                }
            }
        }
    }, [viewer, loadProcess, setCurrentProcess]);

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
            <Breadcrumbs path={ currentInternalPath } onClick={ handleInternalNavigationEntryClicked } />
            <ViewerContainer data-testid="bpmnViewer" ref={ handleViewerRef } className={ className } />
        </DefaultViewerContainer>
    );
}