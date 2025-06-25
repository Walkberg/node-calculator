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
import { useState } from "react";

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
    <NodeContainer id={id} color="#2255fc">
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

export function AddNode({ data, id }: NodeProps) {
  return (
    <NodeContainer id={id} color="#1fc">
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

export function OutputNode({ id, data }: NodeProps) {
  return (
    <NodeContainer id={id} color="#f3c">
      <Handle type="target" position={Position.Left} />
      <div>Output</div>
      <strong>{String(data.value)}</strong>
    </NodeContainer>
  );
}

export const NodeContainer = ({
  children,
  color,
  id,
}: {
  id: string;
  children: React.ReactNode;
  color: string;
}) => {
  const { selectedNodeId, selectNode, deselectNode, deleteNode } =
    useCalculator();

  const [hovered, setHovered] = useState(false);

  const selected = selectedNodeId === id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selected) {
      deselectNode?.();
    } else {
      selectNode?.(id);
    }
  };

  return (
    <div>
      <button
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: "transparent",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          width: 20,
          height: 20,
        }}
        onClick={(e) => {
          e.stopPropagation();
          deleteNode?.(id);
        }}
      >
        x
      </button>
      <div
        onClick={handleClick}
        onMouseOver={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: 10,
          background: color,
          borderRadius: 8,
          border: hovered
            ? "1px solid #00f7ff"
            : selected
            ? "1px solid #16a4a8"
            : "",
        }}
      >
        {children}
      </div>
    </div>
  );
};
