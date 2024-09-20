import { useEffect } from "react";

import type { EventBusEventCallback } from "./hooks.types";
import type { DiagramLike } from "../services";
import { getEventBus } from "../services";

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
