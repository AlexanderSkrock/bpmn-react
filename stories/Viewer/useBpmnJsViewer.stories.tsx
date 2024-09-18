import React, { useEffect } from "react";

import type { StoryObj, Meta } from "@storybook/react";

import { useBpmnJsViewer } from "../../lib/Viewer";
import CoreModule from 'bpmn-js/lib/core';
import BaseViewer, { BaseViewerOptions } from "bpmn-js/lib/BaseViewer";

const BpmnJsViewer = ({ xml }: { xml: string }) => {
    const [handleViewerRef, viewer] = useBpmnJsViewer<BaseViewer, BaseViewerOptions>({
        factory: (options) => new BaseViewer(options),
        options: {
            height: "50vh",
            additionalModules: [CoreModule]
        } as BaseViewerOptions,
    });

    useEffect(() => {
        if (xml) {
            viewer?.importXML(xml);
        }
    }, [viewer, xml])

    return <div ref={ handleViewerRef } />
}

const meta: Meta<typeof BpmnJsViewer> = {
    component: BpmnJsViewer,
    render: (args, { loaded: { xml } }) => <BpmnJsViewer { ...args } xml={ xml } />,
} as Meta<typeof BpmnJsViewer>;

export default meta;

type Story = StoryObj<typeof BpmnJsViewer>;

export const SimpleProcess: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
};
