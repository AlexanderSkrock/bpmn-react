import React, { useEffect } from "react";

import type { StoryObj, Meta } from "@storybook/react";

import CoreModule from "bpmn-js/lib/core";

import { useBaseViewer } from "../../../lib/Viewer";
import type { AttachedZoomOptions } from "../../../lib/Control/Zoom";
import { ZoomControlGroup } from  "../../../lib/Control/Zoom";


const BpmnViewerWithZoomControlGroup = ({ xml, options }: { xml: string, options: AttachedZoomOptions }) => {
    const [ handleViewerRef, viewer ] = useBaseViewer({ additionalModules: [CoreModule]});

    useEffect(() => {
        if (viewer && xml) {
            viewer.importXML(xml);
        }
    }, [viewer, xml])

    return (
        <>
            <div ref={ handleViewerRef } />
            <ZoomControlGroup diagram={ viewer } options={ options } />
        </>
    );
}

const meta: Meta<typeof BpmnViewerWithZoomControlGroup> = {
    component: BpmnViewerWithZoomControlGroup,
    render: (args, { loaded: { xml } }) => <BpmnViewerWithZoomControlGroup { ...args }  xml={ xml } />,
    tags: [ "autodocs" ],
} as Meta<typeof BpmnViewerWithZoomControlGroup>;

export default meta;

type Story = StoryObj<typeof BpmnViewerWithZoomControlGroup>;

export const DefaultZoomControlGroup: Story = {
    loaders: [
        async () => ({
          xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
};

export const AutoFittingZoomControlGroup: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
    args: {
      options: {
          initialFit: true,
      },
    },
};

