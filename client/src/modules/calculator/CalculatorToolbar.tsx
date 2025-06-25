import { useCalculator, type CustomData } from "./CalculatorContext";
import { type Node } from "@xyflow/react";

export const CalculatorToolbar = () => {
  const { setNodes } = useCalculator();

  const handleAddNode = (type: string) => {
    const id = `${type}-${Date.now()}`;

    const newNode: Node<CustomData> = {
      id,
      type,
      position: {
        x: 100 + Math.random() * 400,
        y: 100 + Math.random() * 400,
      },
      data: { label: type, value: type === "floatNode" ? 0 : undefined },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        display: "flex",
        gap: 10,
        zIndex: 10,
      }}
    >
      <button onClick={() => handleAddNode("floatNode")}>+ Float</button>
      <button onClick={() => handleAddNode("addNode")}>+ Add</button>
    </div>
  );
};
