import React from "react";
import type { StoryObj, Meta } from "@storybook/react";

import ViewerWithOverlays from "./ViewerWithOverlays";

const meta: Meta<typeof ViewerWithOverlays> = {
    component: ViewerWithOverlays,
    render: (args, { loaded: { xml } }) => <ViewerWithOverlays { ...args } xml={ xml } />,
    tags: [
        "!dev"
    ]
} as Meta<typeof ViewerWithOverlays>;

export default meta;

type Story = StoryObj<typeof ViewerWithOverlays>;

export const OverlaysConfiguration: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch("overlays/overlays_configuration.bpmn")).text(),
        }),
    ]
};