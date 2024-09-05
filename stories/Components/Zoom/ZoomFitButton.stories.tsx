import React from "react";

import type { StoryObj, Meta } from "@storybook/react";

import { ZoomFitButton } from "../../../lib/Components/Zoom";

const meta: Meta<typeof ZoomFitButton> = {
    component: ZoomFitButton,
} as Meta<typeof ZoomFitButton>;

export default meta;

type Story = StoryObj<typeof ZoomFitButton>;

export const DefaultZoomInButton: Story = {
};

export const ZoomFitButtonWithCustomTooltip: Story = {
    args: {
        title: "Click me to fit to view port!"
    }
};
