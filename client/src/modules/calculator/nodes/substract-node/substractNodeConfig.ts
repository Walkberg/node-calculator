import type { CalculatorNodeConfig } from "../../calculator";

export const substractNodeConfig: CalculatorNodeConfig = {
  type: "minusNode",
  label: "Minus",
  color: "#1cf",
  inputs: [
    { id: "input-1", multiple: false, type: "number" },
    { id: "input-2", multiple: false, type: "number" },
  ],
  outputs: [{ id: "output-1", multiple: true, type: "number" }],
  evaluate: (ctx, node) => {
    const a = ctx.getNodeValue(node.id, "input-1");
    const b = ctx.getNodeValue(node.id, "input-2");
    return a - b;
  },
};
