import React, { useEffect } from "react";
import { Meta, StoryObj } from "@storybook/react";

import MoveCanvasModule from "diagram-js/lib/navigation/movecanvas";
import CoreModule from "bpmn-js/lib/core";
import {ModdleElement, ModuleDeclaration} from "bpmn-js/lib/BaseViewer";

import { useBaseViewer } from "../../../lib/Viewer";
import { ProcessNavigationModule } from "../../../lib/Modules/ProcessNavigation";
import type { CalledElementLoader } from "../../../lib/Modules/ProcessNavigation";

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

const ViewerWithProcessNavigationModule = ({ xml }: { xml: string }) => {
    const [ handleViewerRef, viewer ] = useBaseViewer({ additionalModules: [CoreModule, MoveCanvasModule, ProcessNavigationModule, LoaderModule]});
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
