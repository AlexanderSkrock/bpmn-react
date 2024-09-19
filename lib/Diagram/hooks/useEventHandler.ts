import { useEffect } from "react";

import type { EventBusEventCallback } from "./hooks.types";
import type { DiagramLike } from "../../util/services";
import { getEventBus } from "../../util/services";

const useEventHandler = <T> (diagram: DiagramLike | null, eventName: string, handler: EventBusEventCallback<T>): void => {
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
