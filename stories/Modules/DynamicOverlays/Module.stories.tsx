import React from "react";

import OverlayDefinitionStoryComponent from "./OverlayDefinitionStoryComponent";
import OverlayDefinitionBuilderStoryComponent from "./OverlayDefinitionBuilderStoryComponent";
import OverlayDefinitionsBuilderStoryComponent from "./OverlayDefinitionsBuilderStoryComponent";

export default {
  title: "Modules/DynamicOverlays"
}

export const OverlayDefinitionExample = {
  render: (args, { loaded: { xml } }) => {
    return <OverlayDefinitionStoryComponent xml={ xml } />
  },
  loaders: [
    async () => ({
      xml: await (await fetch("modules/dynamic_overlays/overlay_definition.bpmn")).text(),
    }),
  ],
}

export const OverlayDefinitionBuilderExample = {
  render: (args, { loaded: { xml } }) => {
    return <OverlayDefinitionBuilderStoryComponent xml={ xml } />
  },
  loaders: [
    async () => ({
      xml: await (await fetch("modules/dynamic_overlays/overlay_definition_builder.bpmn")).text(),
    }),
  ],
}

export const OverlayDefinitionsBuilderExample = {
  render: (args, { loaded: { xml } }) => {
    return <OverlayDefinitionsBuilderStoryComponent xml={ xml } />
  },
  loaders: [
    async () => ({
      xml: await (await fetch("modules/dynamic_overlays/overlay_definitions_builder.bpmn")).text(),
    }),
  ],
}