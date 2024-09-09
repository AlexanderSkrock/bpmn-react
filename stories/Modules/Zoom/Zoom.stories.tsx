import React, { useEffect } from "react";
import {Meta, StoryObj} from "@storybook/react";

import CoreModule from "bpmn-js/lib/core";

import { useBaseViewer } from "../../../lib/Viewer";
import { ZoomModule } from "../../../lib/Modules/Zoom";

const ViewerWithZoomModule = ({ xml }: { xml: string }) => {
    const [ handleViewerRef, viewer ] = useBaseViewer({ additionalModules: [CoreModule, ZoomModule]});
    useEffect(() => {
        if (viewer && xml) {
            viewer.importXML(xml);
        }
    }, [viewer, xml])

    return <div ref={ handleViewerRef } />;
}

const meta: Meta<typeof ViewerWithZoomModule> = {
    component: ViewerWithZoomModule,
    render: (args, { loaded: { xml } }) => <ViewerWithZoomModule { ...args } xml={ xml } />,
} as Meta<typeof ViewerWithZoomModule>;

export default meta;

type Story = StoryObj<typeof ViewerWithZoomModule>;

export const DefaultStory: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
};
