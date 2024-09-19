import React, { useEffect } from "react";

import type { StoryObj, Meta } from "@storybook/react";

import CoreModule from "bpmn-js/lib/core";

import { useBaseViewer } from "../../../lib/Viewer";
import type { AttachedZoomOptions } from "../../../lib/Control/Zoom";
import { ZoomOutControl } from  "../../../lib/Control/Zoom";


const BpmnViewerWithZoomControl = ({ xml, options }: { xml: string, options: AttachedZoomOptions }) => {
    const [ handleViewerRef, viewer ] = useBaseViewer({ additionalModules: [CoreModule]});

    useEffect(() => {
        if (viewer && xml) {
            viewer.importXML(xml);
        }
    }, [viewer, xml])

    return (
        <>
            <div ref={ handleViewerRef } />
            <ZoomOutControl diagram={ viewer } options={ options } />
        </>
    );
}

const meta: Meta<typeof BpmnViewerWithZoomControl> = {
    component: BpmnViewerWithZoomControl,
    render: (args, { loaded: { xml } }) => <BpmnViewerWithZoomControl { ...args }  xml={ xml } />,
    tags: [ "autodocs" ],
} as Meta<typeof BpmnViewerWithZoomControl>;

export default meta;

type Story = StoryObj<typeof BpmnViewerWithZoomControl>;

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

