import type { CalculatorNodeConfig } from "../../calculator";

export const addNodeConfig: CalculatorNodeConfig = {
  type: "addNode",
  category: "math",
  label: "Add",
  color: "#1fc",
  inputs: [
    { id: "input-1", multiple: false, type: "number" },
    { id: "input-2", multiple: false, type: "number" },
  ],
  outputs: [{ id: "output-1", multiple: true, type: "number" }],
  evaluate: (ctx, node) => {
    const a = ctx.getNodeValue(node.id, "input-1");
    const b = ctx.getNodeValue(node.id, "input-2");
    return a + b;
  },
};
