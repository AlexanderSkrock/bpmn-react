import { StoryFn, Meta } from "@storybook/react";

import BpmnChart from "./BpmnChart";

export default {
} as Meta<typeof BpmnChart>;

const Template: StoryFn<typeof BpmnChart> = (args) => <BpmnChart {...args} />;

export const BpmnTest = Template.bind({});
BpmnTest.args = {
};