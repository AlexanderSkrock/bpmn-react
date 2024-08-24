import type { StoryObj, Meta } from "@storybook/react";

import HeatmapOverlayBuilder from ".";

import { BpmnChart } from "..";

const meta: Meta<typeof BpmnChart> = {
    component: BpmnChart,
    render: (args, { loaded: { xml } }) => <BpmnChart { ...args } xml={ xml } />,
} as Meta<typeof BpmnChart>;

export default meta;

type Story = StoryObj<typeof BpmnChart>;

export const SimpleSvgHeatmap: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
    args: {
        overlays: [
            new HeatmapOverlayBuilder({
                renderMode: "svg",
                values: {
                    "StartEvent_1": 1,
                    "Event_127b34u": 1,
                    "Activity_1kbapgo": 5,
                    "Event_0mubl9c": 1,
                    "Gateway_053q43x": 3,
                    "Activity_0nvttov": 5,
                    "Activity_1o0wpg8": 5,
                    "Activity_1gxgh10": 5,
                    "Gateway_1mk41gt": 3,
                    "Activity_00ppsme": 5,
                    "Event_1j8rpgs": 1,
                },
            }),
        ]
    }
};

export const SimpleCanvasHeatmap: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
    args: {
        overlays: [
            new HeatmapOverlayBuilder({
                renderMode: "canvas",
                values: {
                    "StartEvent_1": 1,
                    "Event_127b34u": 1,
                    "Activity_1kbapgo": 5,
                    "Event_0mubl9c": 1,
                    "Gateway_053q43x": 3,
                    "Activity_0nvttov": 5,
                    "Activity_1o0wpg8": 5,
                    "Activity_1gxgh10": 5,
                    "Gateway_1mk41gt": 3,
                    "Activity_00ppsme": 5,
                    "Event_1j8rpgs": 1,
                },
            }),
        ]
    }
};