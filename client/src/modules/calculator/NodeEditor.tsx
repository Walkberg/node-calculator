import { Background, Controls, type NodeProps, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCalculator } from "./CalculatorContext";
import { CalculatorToolbar } from "./CalculatorToolbar";

import { CodeViewer } from "./CodeViewer";
import { AddNode, DefaultNode, FloatNode, MinusNode, OutputNode } from "./Node";

const knownNodeTypes: Record<string, React.FC<NodeProps>> = {
  floatNode: FloatNode,
  addNode: AddNode,
  outputNode: OutputNode,
  minusNode: MinusNode,
};

const nodeTypes: Record<string, React.FC<NodeProps>> = new Proxy(
  knownNodeTypes,
  {
    get(target, prop: string) {
      return target[prop] ?? DefaultNode;
    },
  }
);

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
    <div className="w-screen h-screen">
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
