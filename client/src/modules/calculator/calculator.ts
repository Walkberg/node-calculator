import type { Edge, Node } from "@xyflow/react";

export interface CalculatorGraph {
  id: string;
  nodes: CalculatorNode[];
  edges: CalculatorEdge[];
}

export type CustomData = {
  label?: string;
  value?: number;
};

export type CalculatorNode = Node<CustomData>;

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
