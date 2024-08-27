import { useEffect } from "react";

import { getEventBus } from "./serviceHelpers";

const useEventHandler = (diagram, eventName, handler) => {
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
