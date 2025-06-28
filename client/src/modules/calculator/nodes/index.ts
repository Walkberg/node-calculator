import type { CalculatorNodeConfig } from "../calculator";
import { addNodeConfig } from "./add-node/addNodeConfig";
import { floatNodeConfig } from "./float-node/floatNodeConfig";
import { outputNodeConfig } from "./output-node/outputNodeConfig";
import { substractNodeConfig } from "./substract-node/substractNodeConfig";

export * from "./add-node/addNodeConfig";
export * from "./float-node/floatNodeConfig";
export * from "./substract-node/substractNodeConfig";
export * from "./output-node/outputNodeConfig";

export interface NodeConfigModule {
  register: (config: CalculatorNodeConfig) => boolean;
  getConfigs: () => Record<string, CalculatorNodeConfig>;
}

function createNodeConfigModule(): NodeConfigModule {
  const configMap = new Map<string, CalculatorNodeConfig>();
  return {
    register: (config) => {
      if (configMap.has(config.type)) {
        return false;
      }
      configMap.set(config.type, config);
      return true;
    },
    getConfigs: () => {
      const record: Record<string, CalculatorNodeConfig> = {};
      for (const [key, value] of configMap.entries()) {
        record[key] = value;
      }
      return record;
    },
  };
}

export const configModule = createNodeConfigModule();

configModule.register(addNodeConfig);
configModule.register(outputNodeConfig);
configModule.register(floatNodeConfig);
configModule.register(substractNodeConfig);

export const allConfigs = configModule.getConfigs();
