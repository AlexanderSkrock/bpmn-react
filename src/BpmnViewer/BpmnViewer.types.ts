import { ModuleDeclaration } from "didi";
import { Element } from "diagram-js/lib/model";
import { ElementLike } from "diagram-js/lib/model/Types";
import { ElementRegistryFilterCallback } from "diagram-js/lib/core/ElementRegistry";
import Canvas from "diagram-js/lib/core/Canvas";
import { OverlayAttrs } from "diagram-js/lib/features/overlays/Overlays";
import BaseViewer, { ImportXMLError, ImportXMLResult } from "bpmn-js/lib/BaseViewer";

export interface OverlayDefinition {
    type?: string;
    interactive?: boolean;
    element: string | Element;
    config: OverlayAttrs;
}

export interface OverlayBuilderEnvironment {
    rootElement: () => ElementLike,
    canvas: () => Canvas,
}

export interface OverlayDefinitionBuilder {
    elementFilter: string | ElementRegistryFilterCallback;
    buildDefinition: (element: ElementLike, env: OverlayBuilderEnvironment) => OverlayDefinition;
}

export interface OverlayDefinitionsBuilder {
    elementFilter?: ElementRegistryFilterCallback;
    buildDefinitions: (elements: ElementLike[], env: OverlayBuilderEnvironment) => OverlayDefinition[];
}

export function isOverlayDefinition(o: OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder): o is OverlayDefinition {
    const overlay = o as OverlayDefinition;
    return !!overlay.element && !!overlay.config;
}

export function isOverlayDefinitionBuilder(o: OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder): o is OverlayDefinitionBuilder {
    const singleBuilder = o as OverlayDefinitionBuilder;
    return !!singleBuilder.buildDefinition;
}

export function isOverlayDefinitionsBuilder(o: OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder): o is OverlayDefinitionsBuilder {
    const multipleBuilder = o as OverlayDefinitionsBuilder;
    return !!multipleBuilder.buildDefinitions;
}

export interface ProcessViewerProps {
    xml: string;
    overlays?: [ OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder ];
}

export interface BpmnViewerProps {
    process: ProcessViewerProps;
    loadProcess: () => Promise<ProcessViewerProps>;
    modules?: ModuleDeclaration[];
    onViewerInitialized?: (viewer: BaseViewer) => void;
    onLoadingSuccess?: (result: ImportXMLResult) => void;
    onLoadingError?: (error: ImportXMLError) => void;
}
