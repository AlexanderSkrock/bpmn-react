import React from "react";

import type { StoryObj, Meta } from "@storybook/react";

import { is as isType } from "bpmn-js/lib/util/ModelUtil"

import { DefaultViewer } from "../../lib/Viewer";
import { ModdleElement } from "bpmn-js/lib/model/Types";

const meta: Meta<typeof DefaultViewer> = {
    component: DefaultViewer,
    render: (args, { loaded: { xml } }) => <DefaultViewer { ...args } xml={ xml } />,
} as Meta<typeof DefaultViewer>;

export default meta;

type Story = StoryObj<typeof DefaultViewer>;

export const SimpleProcess: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
};

export const ProcessWithEmbeddedSubprocess: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('collapsed_subprocess.bpmn')).text(),
        }),
    ],
    args: {
        loadCalledElement: (calledConfig: ModdleElement) => {
            if (calledConfig.calledElement === "Process_0vsi1d5") {
                return fetch("collapsed_subprocess.bpmn").then(respnse => respnse.text()).then(xml => ({ xml }));
            }
            return Promise.reject("unable to load called element");
        },
    }
};

export const ProcessWithCalledActivity: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('root_process.bpmn')).text(),
        }),
    ],
    args: {
        loadCalledElement: (calledConfig: ModdleElement) => {
            const filePathMapping: { [key: string]: string } = {
                "RootProcess": "root_process.bpmn",
                "Sub_Process": "sub_process.bpmn",
            };
            const path = filePathMapping[calledConfig.calledElement];
            return fetch(path).then(response => response.text()).then(xml => ({ xml }));
        },
    },
};

export const ProcessUsingCollaborationsWithCalledActivity: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('root_process_with_collaboration.bpmn')).text(),
        }),
    ],
    args: {
        loadCalledElement: (calledConfig: ModdleElement) => {
            const filePathMapping: { [key: string]: string } = {
                "RootCollaborationProcess": "root_process_with_collaboration.bpmn",
                "SubCollaborationProcess": "sub_process_with_collaboration.bpmn",
            };
            const path = filePathMapping[calledConfig.calledElement];
            return fetch(path).then(response => response.text()).then(xml => ({ xml }));
        },
    },
};

export const MailMarkerOverlay: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
    args: {
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
    }
};
