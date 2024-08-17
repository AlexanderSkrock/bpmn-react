import React from "react";

import { BpmnChartProps } from "./BpmnChart.types";

const BpmnChart: React.FC<BpmnChartProps> = (props: BpmnChartProps) => {

    return (
        <div data-testid="bpmnChart">
        </div>
    );
};

export default BpmnChart;