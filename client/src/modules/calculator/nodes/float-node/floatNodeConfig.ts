import type { CalculatorNodeConfig } from "../../calculator";

export const floatNodeConfig: CalculatorNodeConfig = {
  type: "floatNode",
  label: "Float",
  color: "#2255fc",
  inputs: [],
  outputs: [{ id: "output-1", multiple: true, type: "number" }],
  evaluate: (__ctx, node) => {
    return node.data?.value ?? 0;
  },
};
