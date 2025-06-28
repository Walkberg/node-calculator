import type { CalculatorNodeConfig } from "../../calculator";

export const floatNodeConfig: CalculatorNodeConfig = {
  type: "floatNode",
  category: "input",
  label: "Float",
  color: "#2255fc",
  inputs: [],
  outputs: [{ id: "output-1", multiple: true, type: "number" }],
  evaluate: (__ctx, node) => {
    return { type: "number", value: node.data?.value ?? 0 };
  },
};
