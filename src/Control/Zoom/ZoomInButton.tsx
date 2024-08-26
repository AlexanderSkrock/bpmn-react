import { useCallback } from "react";

import { ZoomIn as ZoomInIcon } from "grommet-icons";

import type { ZoomInButtonProps } from "./Zoom.types";


const ZoomInButton = ({ onZoomIn }: ZoomInButtonProps) => {
    const handleClick = useCallback(() => {
        onZoomIn();
    }, [onZoomIn]);

    return (
        <div onClick={ handleClick }>
            <ZoomInIcon />
        </div>
    )
};

export default ZoomInButton;