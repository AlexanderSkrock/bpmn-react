import React, { useEffect } from "react";

import type { StoryObj, Meta } from "@storybook/react";

import CoreModule from "bpmn-js/lib/core";

import { BaseViewerOptions, useBaseModeler } from "../../lib/Modeler";

const BpmnJsModeler = ({ xml }: { xml: string }) => {
    const [handleModelerRef, modeler] = useBaseModeler({
            height: "50vh",
            additionalModules: [CoreModule]
    } as BaseViewerOptions);

    useEffect(() => {
        if (xml) {
            modeler?.importXML(xml);
        }
    }, [modeler, xml])

    return <div ref={ handleModelerRef } />
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
            xml: await (await fetch("process.bpmn")).text(),
        }),
    ],
};
