import { useEffect } from "react";

import type { EventBusEventCallback } from "./hooks.types";
import type { DiagramLike } from "../services";
import { getEventBus } from "../services";

/**
 * A React hook to simplify the processing of diagram-js events.
 * <br>
 * This hook manages registering and unregistering event handlers on changes to the event handler.
 * Thus, it can easily be combined with a handler function defined using `useCallback`.
 * @param diagram
 * @param eventName
 * @param handler
 */
const useEventHandler = <Event> (diagram: DiagramLike | null, eventName: string, handler: EventBusEventCallback<Event>): void => {
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
