import React from "react";
import styled from "styled-components";

import type { StoryObj, Meta } from "@storybook/react";

import { breadcrumbClassName, Breadcrumbs, breadcrumbsClassName } from  "../../../lib/Control/Breadcrumbs";


const meta: Meta<typeof Breadcrumbs> = {
    component: Breadcrumbs,
} as Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

export const TopLevelBreadcrumb: Story = {
    args: {
        path: [
            {
                key: "root"
            },
        ],
    },
};

export const HorizontallyNestedBreadcrumb: Story = {
    args: {
        path: [
            {
                key: "root"
            },
            {
                key: "sub"
            },
        ],
    },
};

export const VerticallyNestedBreadcrumb: Story = {
    args: {
        path: [
            {
                key: "root"
            },
            {
                key: "sub"
            }
        ],
        direction: "vertical",
    },
};

export const DisplayNameBreadcrumbs: Story = {
    args: {
        path: [
            {
                key: "root",
                name: "Root",
            },
            {
                key: "sub",
                name: "Sub",
            },
        ],
    },
};

export const DisplayElementBreadcrumbs: Story = {
    args: {
        path: [
            {
                key: "root",
                name: <b>Root</b>,
            },
            {
                key: "sub",
                name: <i>Sub</i>,
            },
        ],
    },
};

export const CustomBreadcrumbs: Story = {
    args: {
        path: [
            {
                key: "layer1",
                name: <h1>Layer 1</h1>,
            },
            {
                key: "layer2",
                name: <h2>Layer 2</h2>,
            },
            {
                key: "layer3",
                name: <h3>Layer 3</h3>,
            },
        ],
    },
    decorators: [
        Story => {
            const Wrapper = styled.div`
                .${breadcrumbsClassName} {
                    align-items: baseline;

                    .${breadcrumbClassName} {
                        background-color: cornflowerblue;
                    }
                }
            `;
            return <Wrapper><Story /></Wrapper>;
        }
    ],
};
