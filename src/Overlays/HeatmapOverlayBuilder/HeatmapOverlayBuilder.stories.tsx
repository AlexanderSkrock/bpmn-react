import type { StoryObj, Meta } from "@storybook/react";

import HeatmapOverlayBuilder from ".";

import BpmnViewer from "../../BpmnViewer";

const meta: Meta<typeof BpmnViewer> = {
    component: BpmnViewer,
    render: (args, { loaded: { process } }) => <BpmnViewer { ...args } process={ { ...args.process, ...process } } />,
} as Meta<typeof BpmnViewer>;

export default meta;

type Story = StoryObj<typeof BpmnViewer>;

export const SimpleSvgHeatmap: Story = {
    loaders: [
        async () => ({
            process: {
                xml: await (await fetch('process.bpmn')).text(),
            },
        }),
    ],
    args: {
        process: {
            overlays: [
                new HeatmapOverlayBuilder({
                    renderMode: "svg",
                    values: {
                        "StartEvent_1": 1,
                        "Event_127b34u": 1,
                        "Activity_1kbapgo": 5,
                        "Event_0mubl9c": 1,
                        "Gateway_053q43x": 3,
                        "Activity_0nvttov": 7,
                        "Activity_1o0wpg8": 5,
                        "Activity_1gxgh10": 7,
                        "Gateway_1mk41gt": 7,
                        "Activity_00ppsme": 5,
                        "Event_1j8rpgs": 1,
                    },
                }),
            ],
        },
    },
};

export const SimpleCanvasHeatmap: Story = {
    loaders: [
        async () => ({
            process: {
                xml: await (await fetch('process.bpmn')).text(),
            },
        }),
    ],
    args: {
        process: {
            overlays: [
                new HeatmapOverlayBuilder({
                    renderMode: "canvas",
                    values: {
                        "StartEvent_1": 1,
                        "Event_127b34u": 1,
                        "Activity_1kbapgo": 5,
                        "Event_0mubl9c": 1,
                        "Gateway_053q43x": 3,
                        "Activity_0nvttov": 7,
                        "Activity_1o0wpg8": 5,
                        "Activity_1gxgh10": 7,
                        "Gateway_1mk41gt": 7,
                        "Activity_00ppsme": 5,
                        "Event_1j8rpgs": 1,
                    },
                }),
            ],
        },
    },
};
