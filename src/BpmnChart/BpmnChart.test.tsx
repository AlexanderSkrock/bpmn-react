import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BpmnChart from "./BpmnChart";

describe("BpmnChart", () => {
  test("should render", () => {
    render(<BpmnChart />);

    expect(screen.getByTestId("bpmnChart")).toBeTruthy();
  });
});