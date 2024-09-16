import React, { useEffect } from "react";

import type { StoryObj, Meta } from "@storybook/react";

import { useBaseViewer } from "../../lib/Viewer";
import CoreModule from 'bpmn-js/lib/core';

const BpmnJsViewer = ({ xml }: { xml: string }) => {
    const [handleViewerRef, viewer] = useBaseViewer({ height: "50vh", additionalModules: [ CoreModule ] });

    useEffect(() => {
        if (xml) {
            viewer?.importXML(xml);
        }
    }, [viewer, xml])

    return <div ref={ handleViewerRef } />
}

const meta: Meta<typeof BpmnJsViewer> = {
    component: BpmnJsViewer,
    render: (args, { loaded: { xml } }) => <BpmnJsViewer { ...args } xml={ xml } />,
} as Meta<typeof BpmnJsViewer>;

export default meta;

type Story = StoryObj<typeof BpmnJsViewer>;

export const SimpleProcess: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
};
