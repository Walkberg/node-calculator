import { useState } from "react";
import { calculatorNodeConfigs, type CalculatorNodeConfig } from "./calculator";
import { useCalculator } from "./CalculatorContext";

export const CalculatorToolbar = () => {
  const [search, setSearch] = useState("");
  const [config, setConfig] = useState(calculatorNodeConfigs);

  const { addNode } = useCalculator();

  const handleAddNode = (type: string) => addNode(type);

  const filtered = filterBySearch(config, search);

  const groupedByCategory = groupByCategory(filtered);

  return (
    <div className="absolute top-4 left-4 z-50  rounded-xl shadow-md p-4 space-y-6 w-72 overflow-y-auto max-h-[90vh]">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {Object.entries(groupedByCategory).map(([category, configs]) => (
        <div key={category}>
          <div className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            {category}
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(configs).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleAddNode(key)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
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

const filterBySearch = (
  config: Record<string, CalculatorNodeConfig>,
  search: string
) => {
  return Object.entries(config).reduce<Record<string, CalculatorNodeConfig>>(
    (acc, [key, config]) => {
      if (config.label.toLowerCase().includes(search.toLowerCase())) {
        acc[key] = config;
      }
      return acc;
    },
    {}
  );
};
