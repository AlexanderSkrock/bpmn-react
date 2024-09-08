import type { Element } from "diagram-js/lib/model";
import type { ElementLike } from "diagram-js/lib/model/Types";
import type { ElementRegistryFilterCallback } from "diagram-js/lib/core/ElementRegistry";
import type Canvas from "diagram-js/lib/core/Canvas";
import type { OverlayAttrs, OverlaysFilter } from "diagram-js/lib/features/overlays/Overlays";

export type { Element } from "diagram-js/lib/model";
export type { ElementLike } from "diagram-js/lib/model/Types";
export type { ElementRegistryFilterCallback } from "diagram-js/lib/core/ElementRegistry";
export type { default as Canvas } from "diagram-js/lib/core/Canvas";
export type { OverlayAttrs, OverlaysFilter } from "diagram-js/lib/features/overlays/Overlays";

export interface DynamicOverlayService {
  add: (overlay: OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder) => string[];
  remove: (filter: OverlaysFilter) => void;
  clear: () => void;
}

export interface OverlayBuilderEnvironment {
  rootElement: () => ElementLike;
  canvas: () => Canvas;
  delegateEvent: (eventType: string, event: Event, element: ElementLike) => void;
}

export interface OverlayDefinition {
  type?: string;
  interactive?: boolean;
  element: string | Element;
  config: OverlayAttrs;
}

export interface OverlayDefinitionBuilder {
  elementFilter: string | ElementRegistryFilterCallback;
  buildDefinition: (element: ElementLike, env: OverlayBuilderEnvironment) => OverlayDefinition;
}

export interface OverlayDefinitionsBuilder {
  elementFilter?: ElementRegistryFilterCallback;
  buildDefinitions: (elements: ElementLike[], env: OverlayBuilderEnvironment) => OverlayDefinition[];
}

export function isOverlayDefinition(o: OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder): o is OverlayDefinition {
  const overlay = o as OverlayDefinition;
  return !!overlay.element && !!overlay.config;
}

export function isOverlayDefinitionBuilder(o: OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder): o is OverlayDefinitionBuilder {
  const singleBuilder = o as OverlayDefinitionBuilder;
  return !!singleBuilder.buildDefinition;
}

export function isOverlayDefinitionsBuilder(o: OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder): o is OverlayDefinitionsBuilder {
  const multipleBuilder = o as OverlayDefinitionsBuilder;
  return !!multipleBuilder.buildDefinitions;
}