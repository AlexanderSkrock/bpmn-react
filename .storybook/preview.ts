import type { Preview } from "@storybook/react";

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        options: {
            storySort: {
                method: "alphabetical",
                order: [
                    "Diagram", [ "Docs", "*", "Types" ],
                    "Viewer",
                    "Modeler",
                    "Modules", [
                        "DynamicOverlays", [
                            "Docs", "*", "Types",
                        ],
                    ],
                    "Overlays", [
                        "Heatmap", [ "Docs", "*", "Types" ],
                    ],
                ],
                locales: "en-US",
            },
        },
    },
};

export default preview;
