import React, { useCallback, useEffect, useState } from "react";

import type { StoryObj, Meta } from "@storybook/react";

import TranslateModule from 'diagram-js/lib/i18n/translate';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import CoreModule from 'bpmn-js/lib/core';
import { ModdleElement } from "bpmn-js/lib/model/Types";
import { is as isType } from "bpmn-js/lib/util/ModelUtil"

import { useBaseViewer } from "../../lib/Viewer"
import {
    DynamicOverlaysModule,
    OverlayDefinition,
    OverlayDefinitionBuilder,
    OverlayDefinitionsBuilder,
    useDynamicOverlays
} from "../../lib/Modules/DynamicOverlays";
import { CalledElementLoader, ProcessNavigationModule } from "../../lib/Modules/ProcessNavigation";
import { ZoomModule } from "../../lib/Modules/Zoom";

type Overlay = OverlayDefinition | OverlayDefinitionBuilder | OverlayDefinitionsBuilder;

const CustomViewer = ({
    xml, overlays = [],
    loadCalledElement
}: {
    xml: string,
    overlays: Overlay[],
    loadCalledElement: (calledElement: ModdleElement) => Promise<{ xml: string, overlays?: Overlay[] }>
}) => {
    const [currentOverlays, setCurrentOverlays] = useState<Overlay[]>(overlays);

    const handleLoadCalledElement = useCallback((calledElement: ModdleElement) => {
        return loadCalledElement(calledElement).then(result => {
            setCurrentOverlays(result.overlays || []);
            return result;
        })
    }, [loadCalledElement, setCurrentOverlays]);

    const [handleViewerRef, viewer] = useBaseViewer({
        additionalModules: [
            CoreModule,
            TranslateModule,
            MoveCanvasModule,
            DynamicOverlaysModule,
            ZoomModule,
            ProcessNavigationModule,
            {
                calledElementLoader: [
                    "type",
                    class CalledElementLoaderImpl implements CalledElementLoader {

                        load = (element: ModdleElement) => {
                            return handleLoadCalledElement(element);
                        }
                    }
                ],
            }
        ],
    });

    useDynamicOverlays(viewer, currentOverlays);

    useEffect(() => {
        if (viewer && xml) {
            viewer.importXML(xml);
        }
    }, [viewer, xml])

    return <div ref={ handleViewerRef } />;
}

const meta: Meta<typeof CustomViewer> = {
    component: CustomViewer,
    render: (args, { loaded: { xml } }) => <CustomViewer { ...args } xml={ xml } />,
} as Meta<typeof CustomViewer>;

export default meta;

type Story = StoryObj<typeof CustomViewer>;

const MailMarkerOverlay: OverlayDefinitionBuilder = {
    elementFilter: element => isType(element, "bpmn:SendTask"),
    buildDefinition: element => ({
        element: element.id,
        config: {
            position: {
                top: -12.5,
                right: 12.5,
            },
            html: `<div style="height: 25px; width: 25px; border-radius:15px; background-color: forestgreen;" />`,
        },
    }),
}

export const CustomViewerWithMailMarkers: Story = {
    loaders: [
        async () => ({
            xml: await (await fetch("custom_viewer/process.bpmn")).text(),
        }),
    ],
    args: {
        loadCalledElement: (element: ModdleElement) => {
            const resourcePaths = {
                "CustomViewerProcess": "custom_viewer/process.bpmn",
                "CustomViewerCalledProcess": "custom_viewer/subprocess.bpmn",
            }
            const resourcePath = resourcePaths[element.calledElement];
            return resourcePath
                ? fetch(resourcePath).then(response => response.text()).then(xml => ({ xml, overlays: [MailMarkerOverlay] }))
                : Promise.reject("unable to load called element");
        },
        overlays: [
            MailMarkerOverlay
        ]
    }
};
