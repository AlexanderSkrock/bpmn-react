import React from "react";
import type { StoryObj, Meta } from "@storybook/react";

import { ZoomInButton } from "../../../lib/Components/Zoom";

const meta: Meta<typeof ZoomInButton> = {
    component: ZoomInButton,
} as Meta<typeof ZoomInButton>;

export default meta;

type Story = StoryObj<typeof ZoomInButton>;

export const DefaultZoomInButton: Story = {
};

export const ZoomInButtonWithCustomTooltip: Story = {
    args: {
        title: "Click me to zoom in!"
    }
};
