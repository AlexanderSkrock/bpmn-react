import React, { useEffect } from "react";

import type { StoryObj, Meta } from "@storybook/react";

import BaseModeler from "bpmn-js/lib/BaseModeler";
import CoreModule from "bpmn-js/lib/core";

import { useBpmnJsModeler, BaseViewerOptions } from "../../lib/Modeler";

const BpmnJsModeler = ({ xml }: { xml: string }) => {
    const [handleViewerRef, viewer] = useBpmnJsModeler<BaseModeler, BaseViewerOptions>({
        factory: (options) => new BaseModeler(options),
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

const meta: Meta<typeof BpmnJsModeler> = {
    component: BpmnJsModeler,
    render: (args, { loaded: { xml } }) => <BpmnJsModeler { ...args } xml={ xml } />,
} as Meta<typeof BpmnJsModeler>;

export default meta;

type Story = StoryObj<typeof BpmnJsModeler>;

export const SimpleProcess: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
};
