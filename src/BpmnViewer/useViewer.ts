import { RefObject, useEffect, useState } from "react";

import OverlaysModule from "diagram-js/lib/features/overlays";
import SelectionModule from "diagram-js/lib/features/selection";
import TranslateModule from "diagram-js/lib/i18n/translate";
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';

import BaseViewer, { BaseViewerOptions, ModuleDeclaration } from "bpmn-js/lib/BaseViewer";
import CoreModule from "bpmn-js/lib/core";

const DEFAULT_MODULES = [
    CoreModule,
    OverlaysModule,
    TranslateModule,
    MoveCanvasModule,
    SelectionModule,
];

const withDefaultModules = (modules?: ModuleDeclaration) => {
    return modules ? [ ...DEFAULT_MODULES, modules ] : DEFAULT_MODULES;
}

const useViewer = (ref: RefObject<HTMLElement>, config?: BaseViewerOptions): BaseViewer | null => {
    const [viewer, setViewer] = useState<BaseViewer | null>(null);

    useEffect(() => {
        if (ref.current && !viewer) {
            setViewer(new BaseViewer({
                ...config,
                container: ref.current,
                additionalModules: withDefaultModules(config?.modules),
            }));
        }

        return () => viewer?.destroy();
    }, [ref.current]);

    return viewer;
};

export default useViewer;
