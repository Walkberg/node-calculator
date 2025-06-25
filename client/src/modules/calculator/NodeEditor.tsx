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
    <div style={{ padding: 10, background: "#eee", borderRadius: 8 }}>
      <div>Input</div>
      <input
        type="number"
        value={String(data.value)}
        onChange={handleChange}
        style={{ width: "80px" }}
      />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export function AddNode({ data }: NodeProps) {
  return (
    <div style={{ padding: 10, background: "#cce", borderRadius: 8 }}>
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
    </div>
  );
}

export function OutputNode({ data }: NodeProps) {
  return (
    <div style={{ padding: 10, background: "#cec", borderRadius: 8 }}>
      <Handle type="target" position={Position.Left} />
      <div>Output</div>
      <strong>{String(data.value)}</strong>
    </div>
  );
}
