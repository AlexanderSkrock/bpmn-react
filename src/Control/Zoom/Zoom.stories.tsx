import { useState } from "react";

import type { StoryObj, Meta } from "@storybook/react";

import { BpmnViewer } from "../../BpmnViewer";

import type { ProcessViewerProps } from "../../BpmnViewer";
import type { AttachedZoomOptions } from "./Zoom.types";

import ZoomControlGroup from "./ZoomControlGroup";
import BaseViewer from "bpmn-js/lib/BaseViewer";

const BpmnViewerWithZoomControlGroup = ({ process, options }: { process: ProcessViewerProps, options: AttachedZoomOptions }) => {
    const [viewer, setViewer] = useState<BaseViewer | null>(null);

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

