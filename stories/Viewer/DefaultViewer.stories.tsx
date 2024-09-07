import React from "react";

import type { StoryObj, Meta } from "@storybook/react";

import { is as isType } from "bpmn-js/lib/util/ModelUtil"

import { DefaultViewer } from "../../lib/Viewer";

const meta: Meta<typeof DefaultViewer> = {
    component: DefaultViewer,
    render: (args, { loaded: { process } }) => <DefaultViewer { ...args } process={ { ...args.process, ...process } } />,
} as Meta<typeof DefaultViewer>;

export default meta;

type Story = StoryObj<typeof DefaultViewer>;

export const SimpleProcess: Story = {
    loaders: [
        async () => ({
            process: {
                xml: await (await fetch('process.bpmn')).text(),
            },
        }),
    ],
};

export const ProcessWithEmbeddedSubprocess: Story = {
    loaders: [
        async () => ({
            process: {
                xml: await (await fetch('collapsed_subprocess.bpmn')).text(),
            },
        }),
    ],
};

export const ProcessWithCalledActivity: Story = {
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
                return fetch("sub_process.bpmn").then(response => response.text()).then(xml => ({ xml }));
            }
            return Promise.reject("unable to load called element");
        },
    },
};

export const ProcessUsingCollaborationsWithCalledActivity: Story = {
    loaders: [
        async () => ({
            process: {
                xml: await (await fetch('root_process_with_collaboration.bpmn')).text(),
            },
        }),
    ],
    args: {
        loadProcess: (calledConfig) => {
            if (calledConfig.calledElement === "SubCollaborationProcess") {
                return fetch("sub_process_with_collaboration.bpmn").then(response => response.text()).then(xml => ({ xml }));
            }
            return Promise.reject("unable to load called element");
        },
    },
};

export const MailMarkerOverlay: Story = {
    loaders: [
        async () => ({
            process: {
                xml: await (await fetch('process.bpmn')).text(),
            },
        }),
    ],
    args: {
        process: {
            overlays: [{
                elementFilter: element => isType(element, "bpmn:SendTask"),
                buildDefinition: element => ({
                    element: element.id,
                    config: {
                        position: {
                            top: -12.5,
                            right: 12.5,
                        },
                        html: `<div style="height: 25px; width: 25px; border-radius:15px; background-color: forestgreen;" />`,
                    },
                }),
            }]
        },
    }
};
