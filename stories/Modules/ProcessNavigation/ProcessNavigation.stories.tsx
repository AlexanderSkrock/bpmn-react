import React, { useEffect } from "react";
import {Meta, StoryObj} from "@storybook/react";

import CoreModule from "bpmn-js/lib/core";

import { useBaseViewer } from "../../../lib/Viewer";
import { ProcessNavigationModule } from "../../../lib/Modules/ProcessNavigation";

const ViewerWithProcessNavigationModule = ({ xml }: { xml: string }) => {
    const [ handleViewerRef, viewer ] = useBaseViewer({ additionalModules: [CoreModule, ProcessNavigationModule]});
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
            xml: await (await fetch('collapsed_subprocess.bpmn')).text(),
        }),
    ],
};
