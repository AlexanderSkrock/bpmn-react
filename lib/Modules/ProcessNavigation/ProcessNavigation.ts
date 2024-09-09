import {ProcessNavigationService} from "./ProcessNavigation.types";
import EventBus from "diagram-js/lib/core/EventBus";
import Canvas from "diagram-js/lib/core/Canvas";
import ElementRegistry from "diagram-js/lib/core/ElementRegistry";
import { ModdleElement } from "bpmn-js/lib/BaseViewer";
import { getBusinessObject, is as isType, isAny as isAnyType } from "bpmn-js/lib/util/ModelUtil";
import { getPlaneIdFromShape } from "bpmn-js/lib/util/DrilldownUtil";

import { renderProcessNavigation } from "./ProcessNavigationControl";
import {PathEntry} from "../../Components/Breadcrumbs";
import {insertAt} from "../../util/html";

export default class ProcessNavigation implements ProcessNavigationService {

    static $inject = [
        "canvas",
        "elementRegistry",
        "eventBus",
    ];

    _canvas: Canvas;
    _elementRegistry: ElementRegistry;

    _navigationContainer: HTMLElement;

    currentStack: ModdleElement[] = [];
    currentPath: PathEntry[] = [];

    constructor(canvas: Canvas, elementRegistry: ElementRegistry, eventBus: EventBus) {
        this._canvas = canvas;
        this._elementRegistry = elementRegistry;

        const navigationContainer = document.createElement("div");
        navigationContainer.style.padding = "8px";
        insertAt(canvas.getContainer(), 0, navigationContainer);
        this._navigationContainer = navigationContainer;

        eventBus.on("element.click", this._handleSubprocessClicked);

        eventBus.on("root.set", this._handleRootSet);
    }

    _handleSubprocessClicked = (event: any): void => {
        if (!isType(event.element, "bpmn:SubProcess")) {
            return;
        }
        const nextRoot = this._canvas.findRoot(getPlaneIdFromShape(event.element));
        if (nextRoot) {
            this._canvas.setRootElement(nextRoot);
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

    _updatePath = (): void => {
        this.currentPath = this.currentStack.filter(businessObject => {
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
        renderProcessNavigation(this._navigationContainer, {
            path: this.currentPath,
            onClick: nextPath => {
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
