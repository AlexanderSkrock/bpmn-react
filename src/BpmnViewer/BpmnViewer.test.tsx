import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";

import BpmnViewer from "./BpmnViewer";

import processXml from "../../resources/process.bpmn";

describe("BpmnChart", () => {
  test("should render", () => {
    render(<BpmnViewer xml={ processXml } />);

    expect(screen.getByTestId("bpmnChart")).toBeTruthy();
  });
});
