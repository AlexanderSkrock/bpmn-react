import { useEffect, useState } from "react";

import CoreModule from "bpmn-js/lib/core";
import OverlaysModule from "diagram-js/lib/features/overlays";
import SelectionModule from "diagram-js/lib/features/selection";
import TranslateModule from "diagram-js/lib/i18n/translate";
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import Viewer from "bpmn-js/lib/BaseViewer";

const DEFAULT_MODULES = [
    CoreModule,
    OverlaysModule,
    TranslateModule,
    MoveCanvasModule,
    SelectionModule,
];

const withDefaultModules = (modules) => {
    return modules ? [ ...DEFAULT_MODULES, modules ] : DEFAULT_MODULES;
}

const useViewer = (ref, config) => {
    const [viewer, setViewer] = useState(null);

    useEffect(() => {
        if (ref.current && !viewer) {
            setViewer(new Viewer({
                ...config,
                container: ref.current,
                additionalModules: withDefaultModules(config.modules),
            }));
        }

        return () => viewer?.destroy();
    }, [ref.current]);

    return viewer;
};

export default useViewer;
