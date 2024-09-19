import React, { useEffect, useMemo } from "react";
import { render } from "react-dom";
import {Meta, StoryObj} from "@storybook/react";

import CoreModule from "bpmn-js/lib/core";

import { useBaseViewer } from "../../../lib/Viewer";
import { ZoomModule } from "../../../lib/Modules/Zoom";
import type { ZoomControlRenderer, ZoomControlRendererProps } from "../../../lib/Modules/Zoom/Zoom.types";
import { ZoomInControl, ZoomOutControl } from "../../../lib/Control/Zoom";
import { insertAt } from "../../../lib/util/html";

const ViewerWithZoomModule = ({ xml, customRenderer }: { xml: string, customRenderer?: ZoomControlRenderer }) => {
    const additionalModules = useMemo(() => {
        const modules = [CoreModule, ZoomModule];
        if (customRenderer) {
            modules.push({
                zoomControlRenderer: [ "type", customRenderer ]
            });
        }
        return modules;
    }, [customRenderer]);

    const [ handleViewerRef, viewer ] = useBaseViewer({ additionalModules });
    useEffect(() => {
        if (viewer && xml) {
            viewer.importXML(xml);
        }
    }, [viewer, xml])

    return <div ref={ handleViewerRef } />;
}

const meta: Meta<typeof ViewerWithZoomModule> = {
    component: ViewerWithZoomModule,
    render: (args, { loaded: { xml } }) => <ViewerWithZoomModule { ...args } xml={ xml } />,
} as Meta<typeof ViewerWithZoomModule>;

export default meta;

type Story = StoryObj<typeof ViewerWithZoomModule>;

export const DefaultStory: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
};

export const CustomRendererStory: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch('process.bpmn')).text(),
        }),
    ],
    args: {
        customRenderer: class CustomControlRenderer implements ZoomControlRenderer {

            controlContainer?: HTMLElement;

            init = (container: HTMLElement) => {
                this.controlContainer = document.createElement("div");                
                insertAt(container, 0, this.controlContainer);
            }
        
            render = ({ diagramLike }: ZoomControlRendererProps) => {
                if (this.controlContainer) {
                    render(
                        <>
                            <ZoomInControl diagram={ diagramLike } options={ { initialFit: true } } />
                            <ZoomOutControl diagram={ diagramLike} options={ { initialFit: true } } />
                        </>,
                        this.controlContainer
                    );
                }
            }
        }
    }
};
