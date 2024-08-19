import { ImportXMLError, ImportXMLResult } from "bpmn-js/lib/BaseViewer";
import { ElementLike } from "diagram-js/lib/model/Types";
import { OverlayAttrs } from "diagram-js/lib/features/overlays/Overlays";
import { ElementRegistryFilterCallback } from "diagram-js/lib/core/ElementRegistry";
import { Element } from "diagram-js/lib/model";

export interface OverlayDefinition {
    type?: string;
    element: string | Element;
    config: OverlayAttrs;
}

export interface SingleOverlayDefinitionBuilder {
    element: string;
    buildDefinition: (element: ElementLike) => OverlayDefinition;
}

export interface MultipleOverlayDefinitionBuilder {
    elementFilter?: ElementRegistryFilterCallback;
    buildDefinition: (element: ElementLike) => OverlayDefinition;
}

export function isOverlayDefinition(o: OverlayDefinition | SingleOverlayDefinitionBuilder | MultipleOverlayDefinitionBuilder): o is OverlayDefinition {
    const overlay = o as OverlayDefinition;
    return !!overlay.element && !!overlay.config;
}

export function isSingleOverlayDefinitionBuilder(o: OverlayDefinition | SingleOverlayDefinitionBuilder | MultipleOverlayDefinitionBuilder): o is SingleOverlayDefinitionBuilder {
    const singleBuilder = o as SingleOverlayDefinitionBuilder;
    return !!singleBuilder.element && !!singleBuilder.buildDefinition;
}

export function isMultipleOverlayDefinitionBuilder(o: OverlayDefinition | SingleOverlayDefinitionBuilder | MultipleOverlayDefinitionBuilder): o is MultipleOverlayDefinitionBuilder {
    if (isSingleOverlayDefinitionBuilder(o)) {
        return false;
    } 
    const multipleBuilder = o as MultipleOverlayDefinitionBuilder;
    return !!multipleBuilder.buildDefinition;
}

export interface BpmnChartProps {
    xml: string,
    overlays?: [ OverlayDefinition | SingleOverlayDefinitionBuilder | MultipleOverlayDefinitionBuilder ],
    onLoadingSuccess?: (result: ImportXMLResult) => void;
    onLoadingError?: (error: ImportXMLError) => void;
}
