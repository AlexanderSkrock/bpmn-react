import { ImportXMLError, ImportXMLResult } from "bpmn-js/lib/BaseViewer";
import { ElementLike } from "diagram-js/lib/model/Types";
import { OverlayAttrs } from "diagram-js/lib/features/overlays/Overlays";
import { ElementRegistryFilterCallback } from "diagram-js/lib/core/ElementRegistry";
import { Element } from "diagram-js/lib/model";
import Canvas from "diagram-js/lib/core/Canvas";

export interface OverlayDefinition {
    type?: string;
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

export interface BpmnChartProps {
    xml: string,
    overlays?: [ OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder ],
    onLoadingSuccess?: (result: ImportXMLResult) => void;
    onLoadingError?: (error: ImportXMLError) => void;
}
