import { useState } from "react";

import type { StoryObj, Meta } from "@storybook/react";

import BpmnChart from "../../BpmnChart/BpmnChart";
import ZoomControlGroup from "./ZoomControlGroup";

const BpmnChartWithZoomControlGroup = ({ xml, options }) => {
    const [viewer, setViewer] = useState(null);

    return (
        <>
            <BpmnChart xml={ xml } onViewerInitialized={ setViewer } />
            <ZoomControlGroup diagram={ viewer } options={ options } />
        </>
    );
}

const meta: Meta<typeof BpmnChartWithZoomControlGroup> = {
    component: BpmnChartWithZoomControlGroup,
    render: (args, { loaded: { xml } }) => <BpmnChartWithZoomControlGroup { ...args } xml={ xml } />,
} as Meta<typeof BpmnChartWithZoomControlGroup>;

export default meta;

type Story = StoryObj<typeof BpmnChartWithZoomControlGroup>;

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

