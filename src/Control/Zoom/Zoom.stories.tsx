import { useState } from "react";

import type { StoryObj, Meta } from "@storybook/react";

import BpmnViewer from "../../BpmnViewer";
import ZoomControlGroup from "./ZoomControlGroup";

const BpmnViewerWithZoomControlGroup = ({ xml, options }) => {
    const [viewer, setViewer] = useState(null);

    return (
        <>
            <BpmnViewer xml={ xml } onViewerInitialized={ setViewer } />
            <ZoomControlGroup diagram={ viewer } options={ options } />
        </>
    );
}

const meta: Meta<typeof BpmnViewerWithZoomControlGroup> = {
    component: BpmnViewerWithZoomControlGroup,
    render: (args, { loaded: { xml } }) => <BpmnViewerWithZoomControlGroup { ...args } xml={ xml } />,
} as Meta<typeof BpmnViewerWithZoomControlGroup>;

export default meta;

type Story = StoryObj<typeof BpmnViewerWithZoomControlGroup>;

export const DefaultZoomControlGroup: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
};

export const AutoFittingZoomControlGroup: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
    args: {
      options: {
          initialFit: true,
      },
    },
};

