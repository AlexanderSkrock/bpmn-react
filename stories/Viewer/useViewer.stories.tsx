import React, { useEffect } from "react";

import type { StoryObj, Meta } from "@storybook/react";

import { useViewer } from "../../lib/Viewer";

const BpmnJsViewer = ({ xml }: { xml: string }) => {
    const [handleViewerRef, viewer] = useViewer({ height: "50vh" });

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
