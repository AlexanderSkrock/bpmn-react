import React from "react";

import type { StoryObj, Meta } from "@storybook/react";

import { ZoomOutButton } from "../../../lib/Components/Zoom";

const meta: Meta<typeof ZoomOutButton> = {
    component: ZoomOutButton,
} as Meta<typeof ZoomOutButton>;

export default meta;

type Story = StoryObj<typeof ZoomOutButton>;

export const DefaultZoomOutButton: Story = {
};

export const ZoomOutButtonWithCustomTooltip: Story = {
    args: {
        title: "Click me to zoom out!"
    }
};
