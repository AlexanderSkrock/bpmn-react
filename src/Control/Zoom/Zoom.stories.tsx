import { useState } from "react";

import type { StoryObj, Meta } from "@storybook/react";

import BpmnViewer from "../../BpmnViewer";
import ZoomControlGroup from "./ZoomControlGroup";

const BpmnViewerWithZoomControlGroup = ({ process, options }) => {
    const [viewer, setViewer] = useState(null);

    return (
        <>
            <BpmnViewer process={ process } onViewerInitialized={ setViewer } />
            <ZoomControlGroup diagram={ viewer } options={ options } />
        </>
    );
}

const meta: Meta<typeof BpmnViewerWithZoomControlGroup> = {
    component: BpmnViewerWithZoomControlGroup,
    render: (args, { loaded: { process } }) => <BpmnViewerWithZoomControlGroup { ...args } process={ { ...args.process, ...process } } />,
} as Meta<typeof BpmnViewerWithZoomControlGroup>;

export default meta;

type Story = StoryObj<typeof BpmnViewerWithZoomControlGroup>;

export const DefaultZoomControlGroup: Story = {
    loaders: [
        async () => ({
            process: {
              xml: await (await fetch('process.bpmn')).text(),
            },
        }),
    ],
};

export const AutoFittingZoomControlGroup: Story = {
    loaders: [
        async () => ({
            process: {
                xml: await (await fetch('process.bpmn')).text(),
            },
        }),
    ],
    args: {
      options: {
          initialFit: true,
      },
    },
};

