import React from "react";
import type { StoryObj, Meta } from "@storybook/react";

import { Heatmap } from "../../../lib/Overlays/Heatmap";

import ViewerWithOverlays from "../ViewerWithOverlays";

const meta: Meta<typeof ViewerWithOverlays> = {
    component: ViewerWithOverlays,
    render: (args, { loaded: { xml } }) => <ViewerWithOverlays { ...args } xml={ xml } />,
} as Meta<typeof ViewerWithOverlays>;

export default meta;

type Story = StoryObj<typeof ViewerWithOverlays>;

export const SimpleSvgHeatmap: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
    args: {
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
};

export const SimpleCanvasHeatmap: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
    args: {
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
            })
        ],
    },
};

export const PerformanceSvgHeatmap: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch("heatmap/performance.bpmn")).text(),
        }),
    ],
    args: {
        overlays: [
            new Heatmap({
                renderMode: "svg",
                values: {
                    "StartEvent_1": 1,
                    "Activity_01ueqqc": 15,
                    "Gateway_1bv3th4": 2,
                    "Activity_194ca2u": 15,
                    "Gateway_06owj5x": 2,
                    "Activity_0t7f06a": 5,
                    "Gateway_17kutfu": 2,
                    "Event_1bmjtdk": 20,
                    "Activity_09hs9tc": 15,
                    "Activity_1rp6goj": 15,
                    "Event_1pp4ahj": 1,
                    "Activity_0fb3qw0": 10,
                    "Activity_1ajpos3": 10,
                    "Event_11dltkm": 1,
                    "Gateway_15hub7d": 2,
                    "Activity_0vbnglx": 5,
                    "Event_12jsdh5": 20,
                    "Activity_1cbo157": 5,
                    "Activity_02ym7m3": 15,
                    "Activity_0amfcup": 15,
                    "Gateway_0gt4tpi": 2,
                    "Activity_0mfzl3o": 5,
                    "Gateway_1rns7zt": 2,
                    "Activity_18nlov2": 15,
                    "Event_1m1to89": 1,
                    "Activity_0f8dpb5": 15,
                    "Activity_1slg2xu": 5,
                    "Activity_0y6g0m5": 10,
                    "Event_1u6lwgo": 1,
                    "Activity_0yfv7pg": 15,
                    "Event_17ll6ic": 1,
                    "Activity_1qfvwvq": 5,
                    "Activity_0ovsll1": 15,
                    "Activity_0zmb9gj": 5,
                    "Gateway_0w17eje": 2,
                    "Event_0kxn5ir": 1,
                    "Activity_0aesgfx": 15,
                    "Event_1tydb67": 1,
                },
            }),
        ],
    },
};

export const PerformanceCanvasHeatmap: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch("heatmap/performance.bpmn")).text(),
        }),
    ],
    args: {
        overlays: [
            new Heatmap({
                renderMode: "canvas",
                values: {
                    "StartEvent_1": 1,
                    "Activity_01ueqqc": 15,
                    "Gateway_1bv3th4": 2,
                    "Activity_194ca2u": 15,
                    "Gateway_06owj5x": 2,
                    "Activity_0t7f06a": 5,
                    "Gateway_17kutfu": 2,
                    "Event_1bmjtdk": 20,
                    "Activity_09hs9tc": 15,
                    "Activity_1rp6goj": 15,
                    "Event_1pp4ahj": 1,
                    "Activity_0fb3qw0": 10,
                    "Activity_1ajpos3": 10,
                    "Event_11dltkm": 1,
                    "Gateway_15hub7d": 2,
                    "Activity_0vbnglx": 5,
                    "Event_12jsdh5": 20,
                    "Activity_1cbo157": 5,
                    "Activity_02ym7m3": 15,
                    "Activity_0amfcup": 15,
                    "Gateway_0gt4tpi": 2,
                    "Activity_0mfzl3o": 5,
                    "Gateway_1rns7zt": 2,
                    "Activity_18nlov2": 15,
                    "Event_1m1to89": 1,
                    "Activity_0f8dpb5": 15,
                    "Activity_1slg2xu": 5,
                    "Activity_0y6g0m5": 10,
                    "Event_1u6lwgo": 1,
                    "Activity_0yfv7pg": 15,
                    "Event_17ll6ic": 1,
                    "Activity_1qfvwvq": 5,
                    "Activity_0ovsll1": 15,
                    "Activity_0zmb9gj": 5,
                    "Gateway_0w17eje": 2,
                    "Event_0kxn5ir": 1,
                    "Activity_0aesgfx": 15,
                    "Event_1tydb67": 1,
                },
            }),
        ],
    },
};

export const HeatmapWithSubprocess: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('root_process.bpmn')).text(),
        }),
    ],
    args: {
        loadCalledElement: (calledConfig) => {
            if (calledConfig.calledElement === "Sub_Process") {
                return fetch("sub_process.bpmn").then(response => response.text()).then(xml => ({
                    xml,
                    overlays: [
                        new Heatmap({
                            renderMode: "svg",
                            values: {
                                "StartEvent_1": 5,
                                "ManualTaskTask": 3,
                                "Event_16fv82x": 1,
                            },
                        }),
                    ],
                }))
            } else if (calledConfig.calledElement === "RootProcess") {
                return fetch("root_process.bpmn").then(response => response.text()).then(xml => ({
                    xml,
                    overlays: [
                        new Heatmap({
                            renderMode: "svg",
                            values: {
                                "StartEvent_1": 1,
                                "CallSubprocessCallActivity": 12,
                                "Event_0iis7zc": 1,
                            },
                        }),
                    ],
                }));
            }
            return Promise.reject(new Error("unable to load called element"));
        },
        overlays: [
            new Heatmap({
                renderMode: "svg",
                values: {
                    "StartEvent_1": 1,
                    "CallSubprocessCallActivity": 12,
                    "Event_0iis7zc": 1,
                },
            }),
        ],
    },
};
