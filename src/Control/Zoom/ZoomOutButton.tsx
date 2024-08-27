import { useCallback } from "react";

import { ZoomOut as ZoomOutIcon } from "grommet-icons";

import type { ZoomOutButtonProps } from "./Zoom.types";


const ZoomInButton = ({ onZoomOut, title = "Zoom out" }: ZoomOutButtonProps) => {
    const handleClick = useCallback(() => {
        onZoomOut();
    }, [onZoomOut]);

    return (
        <div onClick={ handleClick } title={ title }>
            <ZoomOutIcon />
        </div>
    )
};

export default ZoomInButton;