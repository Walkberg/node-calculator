import type { Connection, Edge, Node } from "@xyflow/react";
import {
  substractNodeConfig,
  outputNodeConfig,
  floatNodeConfig,
  addNodeConfig,
} from "./nodes";

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

export function createEvaluator(graph: CalculatorGraph): EvaluationContext {
  const memo = new Map<string, number>();

  const context: EvaluationContext = {
    getNodeValue: (nodeId: string, handleId?: string): number => {
      const memoKey = handleId ? `${nodeId}:${handleId}` : nodeId;
      if (memo.has(memoKey)) return memo.get(memoKey)!;

      const node = graph.nodes.find((n) => n.id === nodeId);
      if (!node) return 0;

      const config = calculatorNodeConfigs[node.type];
      if (!config || !config.evaluate) return 0;

      if (handleId && config.inputs.some((input) => input.id === handleId)) {
        const connectedEdge = graph.edges.find(
          (e) => e.target === nodeId && e.targetHandle === handleId
        );

        if (connectedEdge) {
          const sourceValue = context.getNodeValue(connectedEdge.source);
          memo.set(memoKey, sourceValue);
          return sourceValue;
        } else {
          memo.set(memoKey, 0);
          return 0;
        }
      }

      const value = config.evaluate(context, node);
      memo.set(memoKey, value);

      return value;
    },
  };

  return context;
}

export function evaluateFromOutput(
  graph: CalculatorGraph,
  outputNodeId: string
): CalculatorGraph {
  const context = createEvaluator(graph);
  const visited = new Set<string>();
  const updatedNodesMap = new Map<string, CalculatorNode>();

  function evaluateNode(nodeId: string): void {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = graph.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const config = calculatorNodeConfigs[node.type];
    if (!config) return;

    const incomingEdges = graph.edges.filter((e) => e.target === nodeId);
    for (const edge of incomingEdges) {
      evaluateNode(edge.source);
    }

    try {
      const value = context.getNodeValue(nodeId);
      updatedNodesMap.set(nodeId, {
        ...node,
        data: { ...node.data, value: value as number },
      });
    } catch (error) {
      console.error(`Error evaluating node ${nodeId}:`, error);
      updatedNodesMap.set(nodeId, node);
    }
  }

  evaluateNode(outputNodeId);

  const updatedNodes = graph.nodes.map((node) => {
    return updatedNodesMap.get(node.id) || node;
  });

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

export type SocketType = "number" | "boolean";

export interface Socket {
  id: string;
  multiple: boolean;
  type: SocketType;
}

export type InputSocket = Socket;

export type OutputSocket = Socket;

export type Color = string;

export interface EvaluationContext {
  getNodeValue: (nodeId: string, handleId?: string) => number;
}

type EvaluateFn = (context: EvaluationContext, node: CalculatorNode) => number;

export interface CalculatorNodeConfig {
  type: string;
  category: string;
  label: string;
  color: Color;
  inputs: InputSocket[];
  outputs: OutputSocket[];
  evaluate: EvaluateFn;
}

export const calculatorNodeConfigs: Record<string, CalculatorNodeConfig> = {
  addNode: addNodeConfig,
  outputNode: outputNodeConfig,
  floatNode: floatNodeConfig,
  minusNode: substractNodeConfig,
};
