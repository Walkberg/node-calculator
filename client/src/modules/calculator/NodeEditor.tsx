import {
  Background,
  Controls,
  Handle,
  type NodeProps,
  Position,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCalculator } from "./CalculatorContext";
import { CalculatorToolbar } from "./CalculatorToolbar";

const nodeTypes = {
  floatNode: FloatNode,
  addNode: AddNode,
  outputNode: OutputNode,
};

export function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, evaluate } =
    useCalculator();
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
      <button
        onClick={evaluate}
        style={{ position: "absolute", top: 10, right: 10 }}
      >
        Evaluate
      </button>
      <CalculatorToolbar />
    </div>
  );
}

export function FloatNode({ data, id }: NodeProps) {
  const { updateNodeValue } = useCalculator();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    updateNodeValue(id, value);
  };

  return (
    <NodeContainer color="#2255fc">
      <div>Input</div>
      <input
        type="number"
        value={String(data.value)}
        onChange={handleChange}
        style={{ width: "80px" }}
      />
      <Handle type="source" position={Position.Right} />
    </NodeContainer>
  );
}

export function AddNode({ data }: NodeProps) {
  return (
    <NodeContainer color="#1fc">
      <Handle
        id={"1"}
        type="target"
        position={Position.Left}
        style={{ top: "25%" }}
      />
      <Handle
        id={"2"}
        type="target"
        position={Position.Left}
        style={{ top: "75%" }}
      />
      <div>Add Node</div>
      <strong>{String(data.value) ?? "?"}</strong>
      <Handle type="source" position={Position.Right} />
    </NodeContainer>
  );
}

export function OutputNode({ data }: NodeProps) {
  return (
    <NodeContainer color="#f3c">
      <Handle type="target" position={Position.Left} />
      <div>Output</div>
      <strong>{String(data.value)}</strong>
    </NodeContainer>
  );
}

export const NodeContainer = ({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) => {
  return (
    <div style={{ padding: 10, background: color, borderRadius: 8 }}>
      {children}
    </div>
  );
};
