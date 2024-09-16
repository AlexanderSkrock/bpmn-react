import { ProcessNavigationOverlayRenderer } from "./ProcessNavigation.types";
import { OverlayAttrs } from "diagram-js/lib/features/overlays/Overlays";
import {ElementLike} from "diagram-js/lib/model/Types";

const NavigateToCallActivitySvg = `
    <?xml version="1.0" encoding="utf-8"?>
    <svg viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 0L9 1L11.2929 3.29289L6.2929 8.29289L7.70711 9.70711L12.7071 4.7071L15 7L16 6V0H10Z"/>
        <path d="M1 2H6V4H3V13H12V10H14V15H1V2Z"/>
    </svg>
`;

const NavigateToSubprocessSvg = `
    <?xml version="1.0" encoding="utf-8"?>
    <svg viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.66411 6.8359L3.414 0.585785L0.585571 3.41421L6.83568 9.66432L4.00002 12.5L5.50002 14H14V5.49999L12.5 3.99999L9.66411 6.8359Z"/>
    </svg>
`

export default class DefaultOverlayRenderer implements ProcessNavigationOverlayRenderer {

    renderCallActivityOverlay(element: ElementLike, navigateToCalledElement: () => void): OverlayAttrs {
        const overlayElement = document.createElement("div");
        overlayElement.onclick = navigateToCalledElement;
        overlayElement.style.width = "24px";
        overlayElement.style.height = "24px";
        overlayElement.style.padding = "2px";
        overlayElement.style.backgroundColor = "seagreen";
        overlayElement.innerHTML = NavigateToCallActivitySvg;
        return {
            position: {
                bottom: -8,
                right: -8,
            },
            html: overlayElement,
        };
    }

    renderSubprocessOverlay(element: ElementLike, navigateToSubprocess: () => void): OverlayAttrs {
        const overlayElement = document.createElement("div");
        overlayElement.onclick = navigateToSubprocess;
        overlayElement.style.width = "24px";
        overlayElement.style.height = "24px";
        overlayElement.style.padding = "2px";
        overlayElement.style.backgroundColor = "darkseagreen";
        overlayElement.innerHTML = NavigateToSubprocessSvg;
        return {
            position: {
                bottom: -8,
                right: -8,
            },
            html: overlayElement,
        };
    }

}
