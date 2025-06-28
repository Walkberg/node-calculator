import type { CalculatorNodeConfig } from "../../calculator";

export const equalityNodeConfig: CalculatorNodeConfig = {
  type: "equalityNode",
  label: "Equality",
  category: "math",
  color: "#62f",
  inputs: [
    { id: "input-1", multiple: false, type: "number" },
    { id: "input-2", multiple: false, type: "number" },
  ],
  outputs: [{ id: "output-1", multiple: true, type: "boolean" }],
  evaluate: (ctx, node) => {
    const a = ctx.getNodeValue(node.id, "input-1");
    const b = ctx.getNodeValue(node.id, "input-2");

    if (a === b) {
      return { type: "boolean", value: 1 };
    }

    return { type: "boolean", value: 0 };
  },
};
