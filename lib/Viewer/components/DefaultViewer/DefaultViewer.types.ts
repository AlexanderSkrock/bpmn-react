import type BaseViewer from "bpmn-js/lib/BaseViewer";
import type { ModdleExtensions, ModuleDeclaration, ImportXMLError, ImportXMLResult } from "bpmn-js/lib/BaseViewer";

export type { default as BaseViewer } from "bpmn-js/lib/BaseViewer";
export type { ModdleExtensions, ModuleDeclaration, ImportXMLError, ImportXMLResult } from "bpmn-js/lib/BaseViewer";

export type DefaultViewerProps = {
    process: ProcessViewerProps;
    loadProcess?: (calledElement: CalledBpmnElementDefinition) => Promise<ProcessViewerProps>;

    moddleExtensions?: ModdleExtensions;
    additionalModules?: ModuleDeclaration[];

    onViewerInitialized?: (viewer: BaseViewer) => void;
    onLoadingSuccess?: (result: ImportXMLResult) => void;
    onLoadingError?: (error: ImportXMLError) => void;

    className?: String;
};

export interface CalledBpmnElementDefinition {
    calledElement: string;
}

export interface ProcessViewerProps {
    xml: string;
    overlays?: [ OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder ];
}