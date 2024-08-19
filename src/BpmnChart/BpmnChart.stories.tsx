import type { StoryObj, Meta } from "@storybook/react";

import { is } from "bpmn-js/lib/util/ModelUtil";

import BpmnChart from "./BpmnChart";

const meta: Meta<typeof BpmnChart> = {
    component: BpmnChart,
    render: (args, { loaded: { xml } }) => <BpmnChart { ...args } xml={ xml } />,
} as Meta<typeof BpmnChart>;

export default meta;

type Story = StoryObj<typeof BpmnChart>;

export const SimpleProcess: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
};

export const MailMarkerOverlay: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
    args: {
        overlays: [{
            elementFilter: element => is(element, "bpmn:SendTask"),
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
        }],
    },
};
