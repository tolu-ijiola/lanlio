"use client";

import React, { useState, useEffect } from "react";
import { Keyboard, X } from "lucide-react";

const shortcuts = [
  { keys: ["I"], description: "Insert new component" },
  { keys: ["Ctrl", "D"], description: "Duplicate component" },
  { keys: ["Delete"], description: "Delete component" },
  { keys: ["Ctrl", "Z"], description: "Undo" },
  { keys: ["Ctrl", "Shift", "Z"], description: "Redo" },
  { keys: ["Ctrl", "+"], description: "Zoom in" },
  { keys: ["Ctrl", "-"], description: "Zoom out" },
  { keys: ["1"], description: "Reset zoom to 100%" },
  { keys: ["Ctrl", "B"], description: "Toggle left sidebar" },
  { keys: ["Ctrl", "."], description: "Toggle right sidebar" },
  { keys: ["Ctrl", "S"], description: "Save (auto-save enabled)" },
];

export function KeyboardShortcutsDisplay() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  const formatKey = (key: string) => {
    if (key === "Ctrl") return isMac ? "⌘" : "Ctrl";
    if (key === "Shift") return isMac ? "⇧" : "Shift";
    if (key === "Alt") return isMac ? "⌥" : "Alt";
    return key;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-[oklch(0.6500_0.22_25)] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        title="Keyboard Shortcuts"
      >
        <Keyboard className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[oklch(0.9200_0.005_20)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[oklch(0.6500_0.22_25)]/10 rounded-lg">
              <Keyboard className="h-5 w-5 text-[oklch(0.6500_0.22_25)]" />
            </div>
            <h2 className="text-lg font-semibold text-[oklch(0.2200_0.015_20)]">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-[oklch(0.9600_0.008_30)] rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-[oklch(0.5200_0.015_25)]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-[oklch(0.9200_0.005_20)] rounded-lg hover:border-[oklch(0.6500_0.22_25)] hover:bg-[oklch(0.9950_0.003_15)] transition-all"
              >
                <span className="text-sm text-[oklch(0.5200_0.015_25)]">{shortcut.description}</span>
                <div className="flex items-center gap-1.5">
                  {shortcut.keys.map((key, keyIndex) => (
                    <React.Fragment key={keyIndex}>
                      {keyIndex > 0 && <span className="text-[oklch(0.5200_0.015_25)]">+</span>}
                      <kbd className="px-2.5 py-1.5 text-xs font-semibold bg-[oklch(0.9600_0.008_30)] border border-[oklch(0.9200_0.005_20)] rounded-md text-[oklch(0.2200_0.015_20)] shadow-sm">
                        {formatKey(key)}
                      </kbd>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[oklch(0.9200_0.005_20)] bg-[oklch(0.9800_0.002_20)]">
          <p className="text-xs text-center text-[oklch(0.5200_0.015_25)]">
            Press <kbd className="px-1.5 py-0.5 bg-white border border-[oklch(0.9200_0.005_20)] rounded text-xs">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
}



