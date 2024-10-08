import React, {useEffect, useMemo} from "react";
import { render } from "react-dom";
import { Meta, StoryObj } from "@storybook/react";

import { ElementLike } from "diagram-js/lib/model/Types";
import { OverlayAttrs } from "diagram-js/lib/features/overlays/Overlays";
import MoveCanvasModule from "diagram-js/lib/navigation/movecanvas";
import CoreModule from "bpmn-js/lib/core";
import {ModdleElement, ModuleDeclaration} from "bpmn-js/lib/BaseViewer";

import { useBaseViewer } from "../../../lib/Viewer";
import { ProcessNavigationControlRenderer, ProcessNavigationModule } from "../../../lib/Modules/ProcessNavigation";
import type { CalledElementLoader, ProcessNavigationControlInitOptions } from "../../../lib/Modules/ProcessNavigation";
import { ProcessNavigationOverlayRenderer } from "../../../lib/Modules/ProcessNavigation/ProcessNavigation.types";
import { insertAt } from "../../../lib/util/html";

const LoaderModule: ModuleDeclaration = {
    calledElementLoader: [
        "type",
        class CalledElementLoaderImpl implements CalledElementLoader {

            load = (element: ModdleElement) => {
                const filePathMapping: { [key: string]: string } = {
                    "ProcessNavigationRootProcess": "process_navigation/root.bpmn",
                    "ProcessNavigationCalledProcess1": "process_navigation/called_1.bpmn",
                    "ProcessNavigationCalledProcess2": "process_navigation/called_2.bpmn",
                };
                const path = filePathMapping[element.calledElement];
                return fetch(path).then(response => response.text()).then(xml => ({ xml }));
            }
        }
    ],
};

const ViewerWithProcessNavigationModule = ({ xml, additionalModules }: { xml: string, additionalModules?: ModuleDeclaration[] }) => {
    const modules = useMemo(() => {
        const result = [CoreModule, MoveCanvasModule, ProcessNavigationModule, LoaderModule];
        if (additionalModules) {
            result.push(...additionalModules);
        }
        return result;
    }, [additionalModules]);

    const [ handleViewerRef, viewer ] = useBaseViewer({ additionalModules: modules});
    useEffect(() => {
        if (viewer && xml) {
            viewer.importXML(xml);
        }
    }, [viewer, xml])

    return <div ref={ handleViewerRef } />;
}

const meta: Meta<typeof ViewerWithProcessNavigationModule> = {
    component: ViewerWithProcessNavigationModule,
    render: (args, { loaded: { xml } }) => <ViewerWithProcessNavigationModule { ...args } xml={ xml } />,
} as Meta<typeof ViewerWithProcessNavigationModule>;

export default meta;

type Story = StoryObj<typeof ViewerWithProcessNavigationModule>;

export const DefaultStory: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch("process_navigation/root.bpmn")).text(),
        }),
    ],
};

export const CustomControlRendererStory: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch("process_navigation/root.bpmn")).text(),
        }),
    ],
    args: {
        additionalModules: [{
            processNavigationControlRenderer: [
                "type",
                class ProcessNavigationControlRendererImpl implements ProcessNavigationControlRenderer {

                    controlContainer?: HTMLElement;

                    init = ({ container }: ProcessNavigationControlInitOptions) => {
                        this.controlContainer = document.createElement("div");
                        this.controlContainer.style.padding = "8px";
                        
                        insertAt(container, 0, this.controlContainer);
                    }

                    render = ({ history, path, onHistoryClick, onPathClick }: ProcessNavigationControlProps) => {
                        const entries = [
                            ...history.map(({ key, name }) => ({ key, name, onClick: onHistoryClick })),
                            ...path.slice(1).map(({ key, name }) => ({ key, name, onClick: onPathClick })),
                        ];

                        const buttons = entries.map(({ key, name, onClick }) => {
                            return <button key={ key } onClick={ () => onClick({ key, name}) }>{ name }</button>;
                        })

                        if (this.controlContainer) {
                            render(buttons, this.controlContainer);
                        }
                    }
                }
            ],
        }]
    }
};

export const CustomOverlayRendererStory: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch("process_navigation/root.bpmn")).text(),
        }),
    ],
    args: {
        additionalModules: [{
            processNavigationOverlayRenderer: [
                "type",
                class ProcessNavigationOverlayRendererImpl implements ProcessNavigationOverlayRenderer {
                    renderCallActivityOverlay(element: ElementLike, navigateToCallActivity: () => void): OverlayAttrs {
                        const overlayElement = document.createElement("button");
                        overlayElement.onclick = navigateToCallActivity;
                        overlayElement.style.padding = "2px";
                        overlayElement.innerHTML = "Navigate";
                        return {
                            position: {
                                bottom: -8,
                                right: -8,
                            },
                            html: overlayElement,
                        };
                    }

                    renderSubprocessOverlay(element: ElementLike, navigateToSubprocess: () => void): OverlayAttrs {
                        const overlayElement = document.createElement("button");
                        overlayElement.onclick = navigateToSubprocess;
                        overlayElement.style.padding = "2px";
                        overlayElement.innerHTML = "Navigate";
                        return {
                            position: {
                                bottom: -8,
                                right: -8,
                            },
                            html: overlayElement,
                        };
                    }

                }
            ],
        }]
    }
};
