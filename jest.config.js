module.exports = {
    testEnvironment: "jsdom",
    "transform": {
        "\\.[jt]sx?$": "babel-jest",
        "\\.bpmn$": "<rootDir>/bpmnTransformer.js",
    },
    "transformIgnorePatterns": [
        "node_modules/(?!(bpmn-js|diagram-js|path-intersection)/)"
    ],
    moduleNameMapper: {
        "^path-intersection$": "<rootDir>/node_modules/path-intersection",
    },
};