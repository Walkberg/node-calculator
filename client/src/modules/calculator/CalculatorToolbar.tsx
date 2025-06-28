import { useState } from "react";
import { calculatorNodeConfigs, type CalculatorNodeConfig } from "./calculator";
import { useCalculator } from "./CalculatorContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { configModule } from "./nodes";

const initialValue = configModule.getConfigs();

export const CalculatorToolbar = () => {
  const [search, setSearch] = useState("");
  const [configs] = useState(initialValue);

  const { addNode } = useCalculator();

  const handleAddNode = (type: string) => addNode(type);

  const filtered = filterBySearch(configs, search);

  const groupedByCategory = groupByCategory(filtered);

  return (
    <Card className="absolute top-4 left-4 z-50 shadow-md p-4 space-y-2 w-72 overflow-y-auto max-h-[90vh]">
      <h4>Create node</h4>
      <Input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {Object.entries(groupedByCategory).map(([category, configs]) => (
        <div key={category} className="flex flex-col items-left">
          <div className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            {category}
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(configs).map(([key, config]) => (
              <Button key={key} onClick={() => handleAddNode(key)}>
                {config.label}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
};

function groupByCategory(config: Record<string, CalculatorNodeConfig>) {
  return Object.entries(calculatorNodeConfigs).reduce<{
    [category: string]: typeof calculatorNodeConfigs;
  }>((acc, [key, config]) => {
    if (!acc[config.category]) acc[config.category] = {};
    acc[config.category][key] = config;
    return acc;
  }, {});
}

function filterBySearch(
  config: Record<string, CalculatorNodeConfig>,
  search: string
) {
  return Object.entries(config).reduce<Record<string, CalculatorNodeConfig>>(
    (acc, [key, config]) => {
      if (config.label.toLowerCase().includes(search.toLowerCase())) {
        acc[key] = config;
      }
      return acc;
    },
    {}
  );
}
