import Canvas from "diagram-js/lib/core/Canvas";
import EventBus from "diagram-js/lib/core/EventBus";

import { getBusinessObject, is as isType } from "bpmn-js/lib/util/ModelUtil";
import { getPlaneIdFromShape } from "bpmn-js/lib/util/DrilldownUtil";
import { ElementLike } from "diagram-js/lib/model/Types";
import { DynamicOverlayService, OverlayDefinition, OverlayDefinitionBuilder } from "../DynamicOverlays/DynamicOverlays.types";
import { ProcessNavigationOverlayRenderer } from "./ProcessNavigation.types";
import { NAVIGATE_CALL_ACTIVITY_EVENT, NAVIGATE_SUBPROCESS_EVENT } from "./events";

const PROCESS_NAVIGATION_OVERLAY = "processNavigation";

export default class ProcessNavigationOverlayBehaviour {

    static $inject = [
        "canvas",
        "eventBus",
        "dynamicOverlays",
        "processNavigationOverlayRenderer",
    ];

    _dynamicOverlays: DynamicOverlayService;

    _subprocessOverlayBuilder: OverlayDefinitionBuilder;
    _callActivityOverlayBuilder: OverlayDefinitionBuilder;

    constructor(canvas: Canvas, eventBus: EventBus, dynamicOverlays: DynamicOverlayService, overlayRenderer: ProcessNavigationOverlayRenderer) {
        this._dynamicOverlays = dynamicOverlays;

        this._subprocessOverlayBuilder = {
            elementFilter(element: ElementLike): boolean {
                return isType(element, "bpmn:SubProcess") && !!canvas.findRoot(getPlaneIdFromShape(element));
            },
            buildDefinition(element: ElementLike): OverlayDefinition {
                return {
                    element: element.id,
                    interactive: true,
                    type: PROCESS_NAVIGATION_OVERLAY,
                    config: overlayRenderer.renderSubprocessOverlay(element, () => eventBus.fire(NAVIGATE_SUBPROCESS_EVENT, { element })),
                };
            },
        };

        this._callActivityOverlayBuilder = {
            elementFilter(element: ElementLike): boolean {
                return isType(element, "bpmn:CallActivity") && !!getBusinessObject(element).calledElement;
            },
            buildDefinition(element: ElementLike): OverlayDefinition {
                return {
                    element: element.id,
                    interactive: true,
                    type: PROCESS_NAVIGATION_OVERLAY,
                    config: overlayRenderer.renderCallActivityOverlay(element, () => eventBus.fire(NAVIGATE_CALL_ACTIVITY_EVENT, { element })),
                };
            },
        }

        eventBus.on("import.render.start", this._handleImportRenderStart);
        eventBus.on("import.render.complete", this._handleImportRenderComplete);
    }

    _handleImportRenderStart = () => {
        this._dynamicOverlays.remove({ type: PROCESS_NAVIGATION_OVERLAY });
    }

    _handleImportRenderComplete = () => {
        this._dynamicOverlays.add(this._subprocessOverlayBuilder);
        this._dynamicOverlays.add(this._callActivityOverlayBuilder);
    }
}
