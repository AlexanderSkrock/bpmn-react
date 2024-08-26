import { useCallback } from "react";

import { Target as ZoomResetIcon } from "grommet-icons";

import type { ZoomFitButtonProps } from "./Zoom.types";


const ZoomFitButton = ({ onZoomFit }: ZoomFitButtonProps) => {
    const handleClick = useCallback(() => {
        onZoomFit();
    }, [onZoomFit]);

    return (
        <div onClick={ handleClick }>
            <ZoomResetIcon />
        </div>
    )
};

export default ZoomFitButton;