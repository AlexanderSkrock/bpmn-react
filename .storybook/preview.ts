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
                    "Diagram",
                    "Viewer",
                    "Modeler",
                    "Modules", [
                        "DynamicOverlays", [
                            "Docs", "getDynamicOverlays", "useDynamicOverlays", "*", "Types"
                        ],
                    ],
                    "Overlays",
                ],
                locales: "en-US",
            },
        },
    },
};

export default preview;
