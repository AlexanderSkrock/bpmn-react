import {
    CalledElementLoader, ProcessNavigationControlRenderer,
    ProcessNavigationService,
} from "./ProcessNavigation.types";
import EventBus from "diagram-js/lib/core/EventBus";
import Canvas from "diagram-js/lib/core/Canvas";
import ElementRegistry from "diagram-js/lib/core/ElementRegistry";
import BaseViewer, { ImportParseCompleteEvent, ImportParseStartEvent, ModdleElement } from "bpmn-js/lib/BaseViewer";
import { getBusinessObject, is as isType, isAny as isAnyType } from "bpmn-js/lib/util/ModelUtil";
import { getPlaneIdFromShape } from "bpmn-js/lib/util/DrilldownUtil";

import { PathEntry } from "../../Components/Breadcrumbs";
import { insertAt } from "../../util/html";
import {
    NAVIGATE_CALL_ACTIVITY_EVENT,
    NAVIGATE_SUBPROCESS_EVENT
} from "./events";

export default class ProcessNavigation implements ProcessNavigationService {

    static $inject = [
        "bpmnjs",
        "calledElementLoader",
        "canvas",
        "elementRegistry",
        "eventBus",
        "processNavigationControlRenderer",
    ];

    _viewer: BaseViewer;
    _calledElementLoader: CalledElementLoader;
    _canvas: Canvas;
    _elementRegistry: ElementRegistry;
    _processNavigationControlRenderer: ProcessNavigationControlRenderer;

    processHistory: ModdleElement[] = [];
    processPath: PathEntry[] = [];
    currentStack: ModdleElement[] = [];
    currentPath: PathEntry[] = [];

    currentlyLoadingXml?: string;

    constructor(viewer: BaseViewer, calledElementLoader: CalledElementLoader, canvas: Canvas, elementRegistry: ElementRegistry, eventBus: EventBus, processNavigationControlRenderer: ProcessNavigationControlRenderer) {
        this._viewer = viewer;
        this._calledElementLoader = calledElementLoader;
        this._canvas = canvas;
        this._elementRegistry = elementRegistry;
        this._processNavigationControlRenderer = processNavigationControlRenderer;

        const navigationContainer = document.createElement("div");
        insertAt(canvas.getContainer(), 0, navigationContainer);
        this._processNavigationControlRenderer.init(navigationContainer)

        eventBus.on("import.parse.start", this._handleParseStart);
        eventBus.on("import.parse.complete", this._handleParseComplete);
        eventBus.on("root.set", this._handleRootSet);

        eventBus.on("element.changed", this._handleElementChanged);

        eventBus.on(NAVIGATE_CALL_ACTIVITY_EVENT, this._navigateToCallActivity);
        eventBus.on(NAVIGATE_SUBPROCESS_EVENT, this._navigateToSubprocess);
    }

    _navigateToCallActivity = (event: any): void => {
        if (!isType(event.element, "bpmn:CallActivity")) {
            return;
        }

        const businessElement = getBusinessObject(event.element);
        this._calledElementLoader.load(businessElement).then(({ xml }) => {
            this.currentlyLoadingXml = xml;
            this._viewer.importXML(xml);
        });
    }

    _navigateToSubprocess = (event: any): void => {
        if (!isType(event.element, "bpmn:SubProcess")) {
            return;
        }
        const nextRoot = this._canvas.findRoot(getPlaneIdFromShape(event.element));
        if (nextRoot) {
            this._canvas.setRootElement(nextRoot);
        }
    }

    _handleParseStart = (event: ImportParseStartEvent) => {
        if (event.xml !== this.currentlyLoadingXml) {
            this.processHistory = [];
        }
        this.currentlyLoadingXml = undefined;
    }

    _handleParseComplete = (event: ImportParseCompleteEvent) => {
        let processElement = event.definitions?.rootElements?.filter((element: ModdleElement) => isType(element, "bpmn:Process"))?.[0];
        if (processElement) {
            this.processHistory.push(processElement);
            this._updateProcessPath();
        }
    }

    _handleRootSet = (event: any): void => {
        const businessObject = getBusinessObject(event.element);

        const reverseParents = [];

        for (let element = businessObject; element; element = element.$parent) {
            if (isAnyType(element, ["bpmn:SubProcess", "bpmn:Process"])) {
                reverseParents.push(element);
            }
        }

        const parents = reverseParents.reverse();

        this.currentStack = parents;

        this._updatePath();
    }

    _handleElementChanged = (event: any) => {
        // TODO check and update navigation if ids or names changed
    }

    _updateProcessPath = (): void => {
        this.processPath = this.processHistory.map(businessObject => ({
            key: businessObject.id,
            name: businessObject.name ?? businessObject.id
        }));

        this._renderNavigation();
    }

    _updatePath = (): void => {
        this.currentPath = this.currentStack.filter((businessObject: ModdleElement) => {
            if (this._canvas.findRoot(getPlaneIdFromShape(businessObject)) || this._canvas.findRoot(businessObject.id)) {
                return true;
            }
            if (isType(businessObject, "bpmn:Process")) {
                const participant = this._elementRegistry.find(element => {
                    const businessObject = getBusinessObject(element);
                    return businessObject && businessObject.get("processRef") === businessObject;
                });

                return participant && this._canvas.findRoot(participant.id);
            }
            return false;
        }).map(businessObject => ({
            key: businessObject.id,
            name: businessObject.name ?? businessObject.id
        }));

        this._renderNavigation();
    }

    _renderNavigation = (): void => {
        this._processNavigationControlRenderer.render({
            history: this.processPath,
            path: this.currentPath,
            onHistoryClick: nextPath => {
                const indexInPath = this.processPath.findIndex(entry => entry.key === nextPath.key)
                const nextBusinessObject = this.processHistory[indexInPath];

                this.processHistory = this.processHistory.slice(0, indexInPath);

                this._calledElementLoader.load({ calledElement: nextBusinessObject.id }).then(({ xml }) => {
                    this.currentlyLoadingXml = xml;
                    this._viewer.importXML(xml);
                });
            },
            onPathClick: nextPath => {
                const indexInPath = this.currentPath.findIndex(entry => entry.key === nextPath.key)
                const nextBusinessObject = this.currentStack[indexInPath];

                let parentPlane = this._canvas.findRoot(getPlaneIdFromShape(nextBusinessObject)) || this._canvas.findRoot(nextBusinessObject.id);
                if (!parentPlane && isType(nextBusinessObject, "bpmn:Process")) {
                    const participant = this._elementRegistry.find(element => {
                        const businessObject = getBusinessObject(element);
                        return businessObject && businessObject.get('processRef') === businessObject;
                    });

                    parentPlane = participant && this._canvas.findRoot(participant.id);
                }

                if (parentPlane) {
                    this._canvas.setRootElement(parentPlane);
                }
            }
        });
    }
}
