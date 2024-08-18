import type { StoryObj, Meta } from "@storybook/react";

import BpmnChart from "./BpmnChart";

const meta: Meta<typeof BpmnChart> = {
    component: BpmnChart,
    render: (args, { loaded: { xml } }) => <BpmnChart {...args} xml={ xml } />,
} as Meta<typeof BpmnChart>;

export default meta;

type Story = StoryObj<typeof BpmnChart>;

export const Primary: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
};
