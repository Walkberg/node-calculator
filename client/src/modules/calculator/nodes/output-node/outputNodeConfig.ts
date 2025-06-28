import type { CalculatorNodeConfig } from "../../calculator";

export const outputNodeConfig: CalculatorNodeConfig = {
  type: "outputNode",
  category: "input",
  label: "Output",
  color: "#f3c",
  inputs: [{ id: "input-1", multiple: false, type: "number" }],
  outputs: [],
  evaluate: (ctx, node) => {
    return ctx.getNodeValue(node.id, "input-1");
  },
};
