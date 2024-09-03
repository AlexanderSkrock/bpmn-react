import React from "react";

import type { StoryObj, Meta } from "@storybook/react";

import Heatmap from "./Heatmap";

import { DefaultViewer } from "../../Viewer";

const meta: Meta<typeof DefaultViewer> = {
    component: DefaultViewer,
    render: (args, { loaded: { process } }) => <DefaultViewer { ...args } process={ { ...args.process, ...process } } />,
} as Meta<typeof DefaultViewer>;

export default meta;

type Story = StoryObj<typeof DefaultViewer>;

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
                new Heatmap({
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
                new Heatmap({
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

export const HeatmapWithSubprocess: Story = {
    loaders: [
        async () => ({
            process: {
                xml: await (await fetch('root_process.bpmn')).text(),
            },
        }),
    ],
    args: {
        loadProcess: (calledConfig) => {
            if (calledConfig.calledElement === "Sub_Process") {
                return fetch("sub_process.bpmn").then(response => response.text()).then(xml => ({
                    xml,
                    overlays: [
                        new Heatmap({
                            renderMode: "svg",
                            values: {
                                "StartEvent_1": 5,
                                "Activity_01pdq87": 12,
                                "Event_16fv82x": 1,
                            },
                        })
                    ]
                }));
            }
            return Promise.reject("unable to load called element");
        },
        process: {
            overlays: [
                new Heatmap({
                    renderMode: "svg",
                    values: {
                        "StartEvent_1": 1,
                        "Root_Process": 3,
                        "Event_0iis7zc": 1,
                    },
                }),
            ],
        },
    },
};