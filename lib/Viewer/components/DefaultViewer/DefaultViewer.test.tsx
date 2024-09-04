import React from "react";

import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";

import DefaultViewer from "./DefaultViewer";

import processXml from "../../resources/process.bpmn";

describe("Viewer", () => {
  test("should render", () => {
    render(<DefaultViewer process={ { xml: processXml } } />);

    expect(screen.getByTestId("bpmnViewer")).toBeTruthy();
  });
});
