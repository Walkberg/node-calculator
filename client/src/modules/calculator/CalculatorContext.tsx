import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "@xyflow/react";
import {
  canConnect,
  evaluateFromOutput,
  type CalculatorEdge,
  type CalculatorNode,
} from "./calculator";
import { generateCodeFromOutput } from "./code-generation";

export const initialNodes: CalculatorNode[] = [
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
];

export const initialEdges: Edge[] = [
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
];

type CalculatorContextType = {
  nodes: CalculatorNode[];
  edges: CalculatorEdge[];
  setNodes: React.Dispatch<React.SetStateAction<CalculatorNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<CalculatorEdge[]>>;
  onNodesChange: (changes: NodeChange<CalculatorNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeValue: (id: string, value: number) => void;
  evaluate: () => void;
  selectNode?: (id: string) => void;
  deselectNode?: () => void;
  deleteNode?: (id: string) => void;
  selectedNodeId?: string | null;
  code: string;
};

const CalculatorContext = createContext<CalculatorContextType | undefined>(
  undefined
);

export const useCalculator = () => {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error("useFlowStore must be used inside FlowProvider");
  return ctx;
};

interface CalculatorProviderProps {
  children: React.ReactNode;
}

export const CalculatorProvider = ({ children }: CalculatorProviderProps) => {
  const [name, setName] = useState("calculator");
  const [nodes, setNodes] = useState<CalculatorNode[]>(initialNodes);
  const [edges, setEdges] = useState<CalculatorEdge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    evaluate();
  }, []);

  const onNodesChange = useCallback((changes: NodeChange<CalculatorNode>[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = (connection: Connection) => {
    if (!canConnect({ id: name, nodes, edges }, connection)) {
      return;
    }
    setEdges((eds) => addEdge(connection, eds));
    evaluate();
  };

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
    const graph = { id: name, nodes, edges };

    const outputNode = nodes.find((n) => n.type === "outputNode");
    if (!outputNode) {
      console.warn("Aucun noeud de sortie trouvé.");
      return;
    }

    const evaluated = evaluateFromOutput(graph, outputNode.id);
    const code = generateCodeFromOutput(graph, outputNode.id);
    setCode(code);
    setNodes(evaluated.nodes);
  }, [nodes, edges, getNodeValue]);

  const deleteNode = (id: string) => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== id && edge.target !== id)
    );
  };

  const selectNode = (id: string) => setSelectedNodeId(id);

  const deselectNode = () => setSelectedNodeId(null);

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
        selectNode,
        deselectNode,
        selectedNodeId,
        deleteNode,
        code,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};
