import React, { useCallback } from "react";

import { ZoomIn as ZoomInIcon } from "grommet-icons";

import type { ZoomInButtonProps } from "./Zoom.types";


const ZoomInButton = ({ onZoomIn, title = "Zoom in" }: ZoomInButtonProps) => {
    const handleClick = useCallback(() => {
        onZoomIn();
    }, [onZoomIn]);

    return (
        <div onClick={ handleClick } title={ title }>
            <ZoomInIcon />
        </div>
    )
};

export default ZoomInButton;