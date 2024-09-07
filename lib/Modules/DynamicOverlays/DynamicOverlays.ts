import { DynamicOverlayService } from "./DynamicOverlays.types";

const dynamicOverlays: DynamicOverlayService = () => {

};

dynamicOverlays.$inject = [
    "eventBus",
    "canvas",
    "elementRegistry",
    "overlays",
];

export default dynamicOverlays;