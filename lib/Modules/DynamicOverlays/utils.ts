import { OverlayAttrs } from "./DynamicOverlays.types";

const wrapOverlay = (config: OverlayAttrs): OverlayAttrs => {
    const overlayContainer = document.createElement("div");
    if (typeof config.html === "string") {
        overlayContainer.innerHTML = config.html;
    } else {
        overlayContainer.appendChild(config.html);
    }

    return {
        ...config,
        html: overlayContainer,
    };
};

export const wrapOverlayInteractive = (config: OverlayAttrs): OverlayAttrs => {
    return wrapOverlay(config);
}

export const wrapOverlayNonInteractive = (config: OverlayAttrs): OverlayAttrs => {
    const wrappedOverlay = wrapOverlay(config);
    if (typeof wrappedOverlay.html !== "string") {
        wrappedOverlay.html.classList.add("non-interactive");
    }
    return wrappedOverlay;
}