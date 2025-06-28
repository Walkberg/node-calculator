import { calculatorNodeConfigs, type CalculatorNode } from "./calculator";
import { useCalculator } from "./CalculatorContext";

export const CalculatorToolbar = () => {
  const configs = calculatorNodeConfigs;
  const { setNodes } = useCalculator();

  const handleAddNode = (type: string) => {
    const id = `${type}-${Date.now()}`;

    const newNode: CalculatorNode = {
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
      {Object.entries(configs).map(([key, config]) => (
        <button key={key} onClick={() => handleAddNode(key)}>
          {config.label}
        </button>
      ))}
    </div>
  );
};
