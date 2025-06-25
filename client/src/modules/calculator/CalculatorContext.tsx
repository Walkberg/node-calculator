import React, { createContext, useContext, useState, useCallback } from "react";
import {
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "@xyflow/react";

type CustomData = {
  label?: string;
  value?: number;
};

const initialNodes: Node<CustomData>[] = [
  {
    id: "float-1",
    type: "floatNode",
    position: { x: 100, y: 100 },
    data: { label: "Input", value: 2 },
  },
  {
    id: "float-2",
    type: "floatNode",
    position: { x: 100, y: 250 },
    data: { label: "Input", value: 3 },
  },
  {
    id: "float-3",
    type: "floatNode",
    position: { x: 50, y: 250 },
    data: { label: "Input", value: 3 },
  },
  {
    id: "add-1",
    type: "addNode",
    position: { x: 300, y: 150 },
    data: { label: "Add" },
  },
  {
    id: "add-2",
    type: "addNode",
    position: { x: 200, y: 150 },
    data: { label: "Add" },
  },
  {
    id: "output-1",
    type: "outputNode",
    position: { x: 500, y: 150 },
    data: { label: "Output", value: 0 },
  },
];

const initialEdges: Edge[] = [];

type CalculatorContextType = {
  nodes: Node<CustomData>[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node<CustomData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeValue: (id: string, value: number) => void;
  evaluate: () => void;
};

const CalculatorContext = createContext<CalculatorContextType | undefined>(
  undefined
);

export const useCalculator = () => {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error("useFlowStore must be used inside FlowProvider");
  return ctx;
};

export const CalculatorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [nodes, setNodes] = useState<Node<CustomData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const updateNodeValue = useCallback((id: string, value: number) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, value } } : node
      )
    );
  }, []);

  const getNodeValue = useCallback(
    (id: string): number | undefined => {
      const node = nodes.find((n) => n.id === id);
      return node?.data?.value ?? 0;
    },
    [nodes]
  );

  const evaluate = useCallback(() => {
    const updatedNodes = [...nodes];

    for (const node of updatedNodes) {
      if (node.type === "addNode") {
        const inputs = edges
          .filter((e) => e.target === node.id)
          .map((e) => getNodeValue(e.source))
          .filter((v): v is number => typeof v === "number");

        const sum = inputs.reduce((a, b) => a + b, 0);
        node.data = { ...node.data, value: sum };
      }

      if (node.type === "outputNode") {
        const edge = edges.find((e) => e.target === node.id);
        const inputValue = edge ? getNodeValue(edge.source) : 0;
        node.data = { ...node.data, value: inputValue };
      }
    }

    setNodes(updatedNodes);
  }, [nodes, edges, getNodeValue]);

  return (
    <CalculatorContext.Provider
      value={{
        nodes,
        edges,
        setNodes,
        setEdges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        updateNodeValue,
        evaluate,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};
