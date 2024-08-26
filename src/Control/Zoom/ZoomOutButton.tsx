import { useCallback } from "react";

import { ZoomOut as ZoomOutIcon } from "grommet-icons";

import type { ZoomOutButtonProps } from "./Zoom.types";


const ZoomInButton = ({ onZoomOut }: ZoomOutButtonProps) => {
    const handleClick = useCallback(() => {
        onZoomOut();
    }, [onZoomOut]);

    return (
        <div onClick={ handleClick }>
            <ZoomOutIcon />
        </div>
    )
};

export default ZoomInButton;