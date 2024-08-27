import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";

import BpmnChart from "./BpmnChart";

import processXml from "../../resources/process.bpmn";

describe("BpmnChart", () => {
  test("should render", () => {
    render(<BpmnChart xml={ processXml } />);

    expect(screen.getByTestId("bpmnChart")).toBeTruthy();
  });
});