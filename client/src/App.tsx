import { ReactFlowProvider } from "@xyflow/react";
import "./App.css";
import { Flow } from "./modules/calculator/NodeEditor";
import { CalculatorProvider } from "./modules/calculator/CalculatorContext";

function App() {
  return (
    <ReactFlowProvider>
      <CalculatorProvider>
        <Flow />
      </CalculatorProvider>
    </ReactFlowProvider>
  );
}

export default App;
