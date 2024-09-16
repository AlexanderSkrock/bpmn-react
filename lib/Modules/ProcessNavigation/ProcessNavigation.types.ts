import {ModdleElement} from "bpmn-js/lib/BaseViewer";
import {PathEntry} from "../../Components/Breadcrumbs";
import {OverlayAttrs} from "diagram-js/lib/features/overlays/Overlays";
import {ElementLike} from "diagram-js/lib/model/Types";

export interface CalledElementLoadResult {
    xml: string,
}

export interface CalledElementLoader {
    load: (calledElement: ModdleElement) => Promise<CalledElementLoadResult>;
}

export interface ProcessNavigationOverlayRenderer {
    renderSubprocessOverlay: (element: ElementLike, navigateToSubprocess: () => void) => OverlayAttrs;
    renderCallActivityOverlay: (element: ElementLike, navigateToCalledElement: () => void) => OverlayAttrs;
}

export interface ProcessNavigationControlRenderer {
    init: (container: HTMLElement) => void;
    render: (props: ProcessNavigationControlProps) => void;
}

export interface ProcessNavigationService {
    navigateToCalledElement: (element: ElementLike) => void;
    navigateToSubprocess: (element: ElementLike) => void;
}

export interface NavigateToCalledElementEvent {
    element: ElementLike;
}

export interface NavigateToSubprocessEvent {
    element: ElementLike;
}

export interface ProcessNavigationControlProps {
    history: PathEntry[],
    path: PathEntry[],
    onHistoryClick: (path: PathEntry) => void;
    onPathClick: (path: PathEntry) => void;
}
