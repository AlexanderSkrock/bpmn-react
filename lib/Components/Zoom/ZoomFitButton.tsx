import React, { useCallback } from "react";

import { Target as ZoomResetIcon } from "grommet-icons";

import type { ZoomFitButtonProps } from "./Zoom.types";


const ZoomFitButton = ({ onZoomFit, title = "Fit viewport" }: ZoomFitButtonProps) => {
    const handleClick = useCallback(() => {
        onZoomFit();
    }, [onZoomFit]);

    return (
        <div onClick={ handleClick } title={ title }>
            <ZoomResetIcon />
        </div>
    )
};

export default ZoomFitButton;