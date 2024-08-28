import { useEffect } from "react";

import Diagram from "diagram-js";
import { EventBusEventCallback } from "diagram-js/lib/core/EventBus";

import { getEventBus } from "./serviceHelpers";

const useEventHandler = <T> (diagram: Diagram | null, eventName: string, handler: EventBusEventCallback<T>): void => {
    useEffect(() => {
        if (diagram) {
            getEventBus(diagram).on(eventName, handler);
        }
        return () => {
            if (diagram) {
                getEventBus(diagram).off(eventName, handler);
            }
        }
    }, [diagram, eventName, handler]);
};

export default useEventHandler;
