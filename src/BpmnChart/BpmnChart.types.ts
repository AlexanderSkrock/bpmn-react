import { ImportXMLError, ImportXMLResult } from "bpmn-js/lib/BaseViewer";

export interface BpmnChartProps {
    xml: string,
    onLoadingSuccess?: (result: ImportXMLResult) => void;
    onLoadingError?: (error: ImportXMLError) => void;
}