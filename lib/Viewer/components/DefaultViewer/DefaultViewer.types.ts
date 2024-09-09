import type BaseViewer from "bpmn-js/lib/BaseViewer";
import type { ModdleElement, ModdleExtensions, ModuleDeclaration, ImportXMLError, ImportXMLResult } from "bpmn-js/lib/BaseViewer";

import type { OverlayDefinition, OverlayDefinitionBuilder, OverlayDefinitionsBuilder } from "../../../Modules/DynamicOverlays";
import { CalledElementLoadResult } from "../../../Modules/ProcessNavigation";

export type { default as BaseViewer, ModdleElement } from "bpmn-js/lib/BaseViewer";
export type { ModdleExtensions, ModuleDeclaration, ImportXMLError, ImportXMLResult } from "bpmn-js/lib/BaseViewer";

export type DefaultViewerProps = {
    xml: string,
    loadCalledElement: (calledElement: ModdleElement) => Promise<ExtendedCalledElementLoadResult>;

    overlays?: Overlays;

    moddleExtensions?: ModdleExtensions;
    additionalModules?: ModuleDeclaration[];

    onViewerInitialized?: (viewer: BaseViewer) => void;
    onLoadingSuccess?: (result: ImportXMLResult) => void;
    onLoadingError?: (error: ImportXMLError) => void;

    className?: string;
};

export interface ExtendedCalledElementLoadResult extends CalledElementLoadResult {
    overlays?: Overlays;
}

export type Overlays = (OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder)[];