import { useEffect } from "react";

import { EventBusEventCallback } from "diagram-js/lib/core/EventBus";

import {DiagramLike, getEventBus} from "../../util/services";

const useEventHandler = <T> (diagramLike: DiagramLike | null, eventName: string, handler: EventBusEventCallback<T>): void => {
    useEffect(() => {
        if (diagramLike) {
            getEventBus(diagramLike).on(eventName, handler);
        }
        return () => {
            if (diagramLike) {
                getEventBus(diagramLike).off(eventName, handler);
            }
        }
    }, [diagramLike, eventName, handler]);
};

export default useEventHandler;
