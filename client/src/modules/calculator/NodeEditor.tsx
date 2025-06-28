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
import { calculatorNodeConfigs, type CalculatorNodeConfig } from "./calculator";
import { CodeViewer } from "./CodeViewer";

const nodeTypes = {
  floatNode: FloatNode,
  addNode: AddNode,
  outputNode: OutputNode,
  minusNode: MinusNode,
};

export function Flow() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    evaluate,
    code,
  } = useCalculator();
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
      <CodeViewer code={code} title="JavaScript généré" />
    </div>
  );
}

export function FloatNode({ data, id, type }: NodeProps) {
  const config = calculatorNodeConfigs[type];
  const { updateNodeValue } = useCalculator();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    updateNodeValue(id, value);
  };

  return (
    <NodeContainer id={id} config={config}>
      <div>Input</div>
      <input
        type="number"
        value={String(data.value)}
        onChange={handleChange}
        style={{ width: "80px" }}
      />
    </NodeContainer>
  );
}

export function AddNode({ data, id, type }: NodeProps) {
  const config = calculatorNodeConfigs[type];

  return (
    <NodeContainer id={id} config={config}>
      <div>{config.label}</div>
      <strong>{String(data.value) ?? "?"}</strong>
    </NodeContainer>
  );
}

export function MinusNode({ data, id, type }: NodeProps) {
  const config = calculatorNodeConfigs[type];

  return (
    <NodeContainer id={id} config={config}>
      <div>{config.label}</div>
      <strong>{String(data.value) ?? "?"}</strong>
    </NodeContainer>
  );
}

export function OutputNode({ id, data, type }: NodeProps) {
  const config = calculatorNodeConfigs[type];
  return (
    <NodeContainer id={id} config={config}>
      <div>{config.label}</div>
      <strong>{String(data.value)}</strong>
    </NodeContainer>
  );
}

export const Sockets = ({
  config,
  type,
}: {
  config: CalculatorNodeConfig;
  type: "inputs" | "outputs";
}) => {
  const sockets = type === "inputs" ? config.inputs : config.outputs;
  const targetType = type === "inputs" ? "target" : "source";
  const targetPosition = type === "inputs" ? Position.Left : Position.Right;

  return sockets.map((socket, index) => (
    <Handle
      id={socket.id}
      type={targetType}
      position={targetPosition}
      style={{
        top: `${lerp(25, 75, index / (sockets.length - 1))}%`,
      }}
    />
  ));
};

const lerp = (a: number, b: number, t: number) => {
  return a + (b - a) * t;
};

export const NodeContainer = ({
  children,
  id,
  config,
}: {
  id: string;
  children: React.ReactNode;

  config: CalculatorNodeConfig;
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
          background: config.color,
          borderRadius: 8,
          border: hovered
            ? "1px solid #00f7ff"
            : selected
            ? "1px solid #16a4a8"
            : "",
        }}
      >
        <Sockets config={config} type="inputs" />
        {children}
        <Sockets config={config} type="outputs" />
      </div>
    </div>
  );
};
