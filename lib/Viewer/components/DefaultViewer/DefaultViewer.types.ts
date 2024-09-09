import type BaseViewer from "bpmn-js/lib/BaseViewer";
import type { ModdleElement, ModdleExtensions, ModuleDeclaration, ImportXMLError, ImportXMLResult } from "bpmn-js/lib/BaseViewer";

import type { OverlayDefinition, OverlayDefinitionBuilder, OverlayDefinitionsBuilder } from "../../../Modules/DynamicOverlays";

export type { default as BaseViewer, ModdleElement } from "bpmn-js/lib/BaseViewer";
export type { ModdleExtensions, ModuleDeclaration, ImportXMLError, ImportXMLResult } from "bpmn-js/lib/BaseViewer";

export type DefaultViewerProps = {
    process: ProcessViewerProps;
    loadProcess?: (calledElement: ModdleElement) => Promise<ProcessViewerProps>;

    moddleExtensions?: ModdleExtensions;
    additionalModules?: ModuleDeclaration[];

    onViewerInitialized?: (viewer: BaseViewer) => void;
    onLoadingSuccess?: (result: ImportXMLResult) => void;
    onLoadingError?: (error: ImportXMLError) => void;

    className?: string;
};

export interface CalledBpmnElementDefinition {
    calledElement: string;
}

export interface ProcessViewerProps {
    xml: string;
    overlays?: [ OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder ];
}
