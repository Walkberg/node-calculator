import { evaluateFromOutput } from "./calculator";

describe("CalculatorGraph Evaluation", () => {
  it("should evaluate a simple addition graph correctly", () => {
    const graph = {
      id: "test-graph",
      nodes: [
        {
          id: "input1",
          type: "floatNode",
          data: { value: 5 },
          position: { x: 0, y: 0 },
        },
        {
          id: "input2",
          type: "floatNode",
          data: { value: 3 },
          position: { x: 0, y: 100 },
        },
        {
          id: "add1",
          type: "addNode",
          data: {},
          position: { x: 200, y: 50 },
        },
        {
          id: "output1",
          type: "outputNode",
          data: {},
          position: { x: 400, y: 50 },
        },
      ],
      edges: [
        {
          id: "e1",
          source: "input1",
          sourceHandle: "output-1",
          target: "add1",
          targetHandle: "input-1",
        },
        {
          id: "e2",
          source: "input2",
          sourceHandle: "output-1",
          target: "add1",
          targetHandle: "input-2",
        },
        {
          id: "e3",
          source: "add1",
          sourceHandle: "output-1",
          target: "output1",
          targetHandle: "input-1",
        },
      ],
    };

    const result = evaluateFromOutput(graph, "output1");

    const outputNode = result.nodes.find((n) => n.id === "output1");
    expect(outputNode?.data.value).toBe(8);

    const addNode = result.nodes.find((n) => n.id === "add1");
    expect(addNode?.data.value).toBe(8);
  });

  it("should evaluate a complexe graph correctly", () => {
    const graph = {
      id: "test-graph",
      nodes: [
        {
          id: "input1",
          type: "floatNode",
          data: { value: 5 },
          position: { x: 0, y: 0 },
        },
        {
          id: "input2",
          type: "floatNode",
          data: { value: 3 },
          position: { x: 0, y: 100 },
        },
        {
          id: "input3",
          type: "floatNode",
          data: { value: 1 },
          position: { x: 0, y: 100 },
        },
        {
          id: "add1",
          type: "addNode",
          data: {},
          position: { x: 200, y: 50 },
        },
        {
          id: "minus1",
          type: "minusNode",
          data: {},
          position: { x: 200, y: 50 },
        },
        {
          id: "output1",
          type: "outputNode",
          data: {},
          position: { x: 400, y: 50 },
        },
      ],
      edges: [
        {
          id: "e1",
          source: "input1",
          sourceHandle: "output-1",
          target: "add1",
          targetHandle: "input-1",
        },
        {
          id: "e2",
          source: "input2",
          sourceHandle: "output-1",
          target: "add1",
          targetHandle: "input-2",
        },
        {
          id: "e3",
          source: "add1",
          sourceHandle: "output-1",
          target: "minus1",
          targetHandle: "input-1",
        },
        {
          id: "e4",
          source: "input3",
          sourceHandle: "output-1",
          target: "minus1",
          targetHandle: "input-2",
        },
        {
          id: "e5",
          source: "minus1",
          sourceHandle: "output-1",
          target: "output1",
          targetHandle: "input-1",
        },
      ],
    };

    const result = evaluateFromOutput(graph, "output1");

    const outputNode = result.nodes.find((n) => n.id === "output1");
    expect(outputNode?.data.value).toBe(7);

    const addNode = result.nodes.find((n) => n.id === "add1");
    expect(addNode?.data.value).toBe(8);
  });

  it("should return 0 for missing connections", () => {
    const graph = {
      id: "graph2",
      nodes: [
        {
          id: "add1",
          type: "addNode",
          data: {},
          position: { x: 100, y: 100 },
        },
        {
          id: "output1",
          type: "outputNode",
          data: {},
          position: { x: 300, y: 100 },
        },
      ],
      edges: [
        {
          id: "e1",
          source: "add1",
          sourceHandle: "output-1",
          target: "output1",
          targetHandle: "input-1",
        },
      ],
    };

    const result = evaluateFromOutput(graph, "output1");
    const output = result.nodes.find((n) => n.id === "output1");
    expect(output?.data.value).toBe(0);
  });
});
