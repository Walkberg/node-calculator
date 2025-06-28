import type { CalculatorNodeConfig } from "../../calculator";

export const booleanNodeConfig: CalculatorNodeConfig = {
  type: "booleanNode",
  label: "Boolean",
  category: "input",
  color: "#4f5",
  inputs: [],
  outputs: [{ id: "output-1", multiple: true, type: "boolean" }],
  evaluate: (ctx, node) => {
    return { type: "boolean", value: 0 };
  },
};
