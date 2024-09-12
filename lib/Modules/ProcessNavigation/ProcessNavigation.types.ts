import {ModdleElement} from "bpmn-js/lib/BaseViewer";
import {PathEntry} from "../../Components/Breadcrumbs";
import {OverlayAttrs} from "diagram-js/lib/features/overlays/Overlays";
import {ElementLike} from "diagram-js/lib/model/Types";

export interface NavigateCalledElementEvent {
    calledElement: ModdleElement;
}

export interface NavigateSubprocessEvent {
    subprocess: ModdleElement;
}

export interface CalledElementLoadResult {
    xml: string,
}

export interface CalledElementLoader {
    load: (calledElement: ModdleElement) => Promise<CalledElementLoadResult>;
}

export interface ProcessNavigationOverlayRenderer {
    renderSubprocessOverlay: (element: ElementLike, navigateToSubprocess: () => void) => OverlayAttrs;
    renderCallActivityOverlay: (element: ElementLike, navigateToCallActivity: () => void) => OverlayAttrs;
}

export interface ProcessNavigationControlRenderer {
    init: (container: HTMLElement) => void;
    render: (props: ProcessNavigationControlProps) => void;
}

export interface ProcessNavigationService {

}

export interface ProcessNavigationControlProps {
    history: PathEntry[],
    path: PathEntry[],
    onHistoryClick: (path: PathEntry) => void;
    onPathClick: (path: PathEntry) => void;
}
