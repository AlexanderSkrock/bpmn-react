import {ModdleElement} from "bpmn-js/lib/BaseViewer";
import {PathEntry} from "../../Components/Breadcrumbs";

export interface CalledElementLoadResult {
    xml: string,
}

export interface CalledElementLoader {
    load: (calledElement: ModdleElement) => Promise<CalledElementLoadResult>;
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
