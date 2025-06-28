import React, { useState } from "react";
import { Copy, Code, Eye, EyeOff, Download } from "lucide-react";

interface CodeViewerProps {
  code: string;
  title?: string;
}

export function CodeViewer({ code, title = "Code généré" }: CodeViewerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-code.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!code || code.trim() === '""' || code.trim() === "") {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center gap-2 text-gray-400">
          <Code size={16} />
          <span className="text-sm">Aucun code généré</span>
        </div>
      </div>
    );
  }

  const cleanCode = code;

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-80 bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Code size={16} className="text-blue-400" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            title="Copier le code"
          >
            <Copy
              size={14}
              className={isCopied ? "text-green-400" : "text-gray-300"}
            />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            title="Télécharger le code"
          >
            <Download size={14} className="text-gray-300" />
          </button>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            title={isVisible ? "Masquer" : "Afficher"}
          >
            {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      {isVisible && (
        <div className="p-3 overflow-auto max-h-64">
          <pre className="text-xs leading-relaxed">
            <code className="text-gray-100">
              {cleanCode.split("\n").map((line, index) => (
                <div key={index} className="flex">
                  <span
                    className="text-gray-500 select-none mr-3 text-right"
                    style={{ minWidth: "2rem" }}
                  >
                    {index + 1}
                  </span>
                  <span className="flex-1">
                    {line
                      .split(
                        /(\bconst\b|\blet\b|\bvar\b|\bfunction\b|\breturn\b|\bif\b|\belse\b|\bfor\b|\bwhile\b)/g
                      )
                      .map((part, i) => {
                        if (
                          [
                            "const",
                            "let",
                            "var",
                            "function",
                            "return",
                            "if",
                            "else",
                            "for",
                            "while",
                          ].includes(part)
                        ) {
                          return (
                            <span
                              key={i}
                              className="text-purple-400 font-semibold"
                            >
                              {part}
                            </span>
                          );
                        }
                        return part.split(/(\d+)/g).map((subpart, j) => {
                          if (/^\d+$/.test(subpart)) {
                            return (
                              <span key={j} className="text-orange-400">
                                {subpart}
                              </span>
                            );
                          }
                          return subpart
                            .split(/(=|;|\+|\-|\*|\/)/g)
                            .map((op, k) => {
                              if (["=", ";", "+", "-", "*", "/"].includes(op)) {
                                return (
                                  <span key={k} className="text-yellow-400">
                                    {op}
                                  </span>
                                );
                              }
                              return op;
                            });
                        });
                      })}
                  </span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      )}
      {isVisible && (
        <div className="px-3 py-2 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{cleanCode.split("\n").length} lignes</span>
            {isCopied && <span className="text-green-400">Copié !</span>}
          </div>
        </div>
      )}
    </div>
  );
}
