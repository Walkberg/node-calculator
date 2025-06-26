import type { Connection, Edge, Node } from "@xyflow/react";

export interface CalculatorGraph {
  id: string;
  nodes: CalculatorNode[];
  edges: CalculatorEdge[];
}

export type CustomData = {
  label?: string;
  value?: number;
};

export type CalculatorNode = Node<CustomData> & {
  type: string;
};

export type CalculatorEdge = Edge;

export function getNodeValue(
  graph: CalculatorGraph,
  id: string
): number | undefined {
  const node = graph.nodes.find((n) => n.id === id);
  return node?.data.value ?? 0;
}

export function evaluateGraph(graph: CalculatorGraph): CalculatorGraph {
  const updatedNodes = [...graph.nodes];

  for (const node of updatedNodes) {
    if (node.type === "addNode") {
      const inputs = graph.edges
        .filter((e) => e.target === node.id)
        .map((e) => getNodeValue(graph, e.source))
        .filter((v): v is number => typeof v === "number");

      const sum = inputs.reduce((a, b) => a + b, 0);
      node.data = { ...node.data, value: sum };
    }

    if (node.type === "outputNode") {
      const edge = graph.edges.find((e) => e.target === node.id);
      const inputValue = edge ? getNodeValue(graph, edge.source) : 0;
      node.data = { ...node.data, value: inputValue };
    }
  }

  return { ...graph, nodes: updatedNodes };
}

export function canConnect(
  graph: CalculatorGraph,
  connection: Connection
): boolean {
  const sourceNode = graph.nodes.find((n) => n.id === connection.source);
  const targetNode = graph.nodes.find((n) => n.id === connection.target);

  if (!sourceNode || !targetNode) return false;

  const sourceConfig = calculatorNodeConfigs[sourceNode.type];
  const targetConfig = calculatorNodeConfigs[targetNode.type];

  if (!sourceConfig || !targetConfig) return false;

  const sourceHandleId = connection.sourceHandle;
  const targetHandleId = connection.targetHandle;

  const sourceOutput = sourceConfig.outputs.find(
    (o) => o.id === sourceHandleId
  );
  const targetInput = targetConfig.inputs.find((i) => i.id === targetHandleId);

  if (!sourceOutput || !targetInput) return false;

  if (sourceOutput.type !== targetInput.type) return false;

  const inputOccupied =
    !targetInput.multiple &&
    graph.edges.some(
      (e) => e.target === targetNode.id && e.targetHandle === targetHandleId
    );

  const outputOccupied =
    !sourceOutput.multiple &&
    graph.edges.some(
      (e) => e.source === sourceNode.id && e.sourceHandle === sourceHandleId
    );

  return !inputOccupied && !outputOccupied;
}

export function deleteNode(
  graph: CalculatorGraph,
  id: string
): CalculatorGraph {
  const updatedNodes = graph.nodes.filter((n) => n.id !== id);
  const updatedEdges = graph.edges.filter(
    (e) => e.source !== id && e.target !== id
  );

  return { ...graph, nodes: updatedNodes, edges: updatedEdges };
}

export type SocketType = "number" | "boolean";

export interface Socket {
  id: string;
  multiple: boolean;
  type: SocketType;
}

export type InputSocket = Socket;

export type OutputSocket = Socket;

export type Color = string;

export interface CalculatorNodeConfig {
  type: string;
  label: string;
  color: Color;
  inputs: InputSocket[];
  outputs: OutputSocket[];
}

export const addNodeConfig: CalculatorNodeConfig = {
  type: "addNode",
  label: "Add",
  color: "#1fc",
  inputs: [
    { id: "input-1", multiple: false, type: "number" },
    { id: "input-2", multiple: false, type: "number" },
  ],
  outputs: [{ id: "output-1", multiple: true, type: "number" }],
};

export const minusNodeConfig: CalculatorNodeConfig = {
  type: "minusNode",
  label: "Minus",
  color: "#1cf",
  inputs: [
    { id: "input-1", multiple: false, type: "number" },
    { id: "input-2", multiple: false, type: "number" },
  ],
  outputs: [{ id: "output-1", multiple: true, type: "number" }],
};

export const outputNodeConfig: CalculatorNodeConfig = {
  type: "outputNode",
  label: "Output",
  color: "#f3c",
  inputs: [{ id: "input-1", multiple: false, type: "number" }],
  outputs: [],
};

export const floatNodeConfig: CalculatorNodeConfig = {
  type: "floatNode",
  label: "Float",
  color: "#2255fc",
  inputs: [],
  outputs: [{ id: "output-1", multiple: true, type: "number" }],
};

export const calculatorNodeConfigs: Record<string, CalculatorNodeConfig> = {
  addNode: addNodeConfig,
  outputNode: outputNodeConfig,
  floatNode: floatNodeConfig,
  minusNode: minusNodeConfig,
};
