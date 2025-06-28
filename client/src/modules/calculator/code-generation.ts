import type { CalculatorGraph, CalculatorNode } from "./calculator";

export interface CodeGenerationContext {
  variables: Map<string, string>;
  statements: string[];
  getVariableName: (nodeId: string) => string;
}

type CodeGeneratorFn = (
  context: CodeGenerationContext,
  node: CalculatorNode,
  graph: CalculatorGraph
) => void;

export interface CalculatorNodeCodeConfig {
  generateCode: CodeGeneratorFn;
}

export function generateVariableName(nodeId: string, nodeType: string): string {
  const typeMap: Record<string, string> = {
    floatNode: "input",
    addNode: "sum",
    minusNode: "diff",
    outputNode: "result",
  };

  const baseName = typeMap[nodeType] || "value";
  const suffix =
    nodeId.replace(/[^a-zA-Z0-9]/g, "").slice(-2) ||
    Math.random().toString(36).substr(2, 2);
  return `${baseName}_${suffix}`;
}

export function createCodeGenerator(
  graph: CalculatorGraph
): CodeGenerationContext {
  const variables = new Map<string, string>();
  const statements: string[] = [];

  graph.nodes.forEach((node) => {
    if (!variables.has(node.id)) {
      variables.set(node.id, generateVariableName(node.id, node.type));
    }
  });

  const context: CodeGenerationContext = {
    variables,
    statements,
    getVariableName: (nodeId: string) => {
      return variables.get(nodeId) || `unknown_${nodeId}`;
    },
  };

  return context;
}

export function generateCodeFromOutput(
  graph: CalculatorGraph,
  outputNodeId: string
): string {
  const context = createCodeGenerator(graph);
  const visited = new Set<string>();

  function generateNodeCode(nodeId: string): void {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = graph.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const incomingEdges = graph.edges.filter((e) => e.target === nodeId);
    for (const edge of incomingEdges) {
      generateNodeCode(edge.source);
    }

    const codeConfig = calculatorNodeCodeConfigs[node.type];
    if (codeConfig && codeConfig.generateCode) {
      codeConfig.generateCode(context, node, graph);
    }
  }

  generateNodeCode(outputNodeId);

  return context.statements.join("\n");
}

export const floatNodeCodeConfig: CalculatorNodeCodeConfig = {
  generateCode: (context, node) => {
    const varName = context.getVariableName(node.id);
    const value = node.data?.value ?? 0;
    context.statements.push(`const ${varName} = ${value};`);
  },
};

export const addNodeCodeConfig: CalculatorNodeCodeConfig = {
  generateCode: (context, node, graph) => {
    const varName = context.getVariableName(node.id);

    const input1Edge = graph.edges.find(
      (e) => e.target === node.id && e.targetHandle === "input-1"
    );
    const input2Edge = graph.edges.find(
      (e) => e.target === node.id && e.targetHandle === "input-2"
    );

    const input1Var = input1Edge
      ? context.getVariableName(input1Edge.source)
      : "0";
    const input2Var = input2Edge
      ? context.getVariableName(input2Edge.source)
      : "0";

    context.statements.push(`const ${varName} = ${input1Var} + ${input2Var};`);
  },
};

export const minusNodeCodeConfig: CalculatorNodeCodeConfig = {
  generateCode: (context, node, graph) => {
    const varName = context.getVariableName(node.id);

    const input1Edge = graph.edges.find(
      (e) => e.target === node.id && e.targetHandle === "input-1"
    );
    const input2Edge = graph.edges.find(
      (e) => e.target === node.id && e.targetHandle === "input-2"
    );

    const input1Var = input1Edge
      ? context.getVariableName(input1Edge.source)
      : "0";
    const input2Var = input2Edge
      ? context.getVariableName(input2Edge.source)
      : "0";

    context.statements.push(`const ${varName} = ${input1Var} - ${input2Var};`);
  },
};

export const outputNodeCodeConfig: CalculatorNodeCodeConfig = {
  generateCode: (context, node, graph) => {
    const varName = context.getVariableName(node.id);

    const inputEdge = graph.edges.find(
      (e) => e.target === node.id && e.targetHandle === "input-1"
    );
    const inputVar = inputEdge
      ? context.getVariableName(inputEdge.source)
      : "0";

    context.statements.push(`const ${varName} = ${inputVar};`);
  },
};

export const calculatorNodeCodeConfigs: Record<
  string,
  CalculatorNodeCodeConfig
> = {
  floatNode: floatNodeCodeConfig,
  addNode: addNodeCodeConfig,
  minusNode: minusNodeCodeConfig,
  outputNode: outputNodeCodeConfig,
};
