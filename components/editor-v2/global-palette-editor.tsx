"use client";

import React, { useState } from "react";
import { Copy, Check, Pin } from "lucide-react";
import { useEditorStore } from "@/stores/editor-v2/store";
import { DesignPalette } from "@/lib/editor-state";
import { Tooltip } from "./tooltip";

export function GlobalPaletteEditor() {
  const { designPalette, setDesignPalette } = useEditorStore();
  const [copied, setCopied] = useState<string | null>(null);

  const handleColorChange = (key: keyof DesignPalette, value: string) => {
    setDesignPalette({ ...designPalette, [key]: value });
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopied(color);
    setTimeout(() => setCopied(null), 2000);
  };

  const getContrastWarning = (color: string, bgColor: string) => {
    // Simple contrast check (can be enhanced)
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };

    const getLuminance = (rgb: { r: number; g: number; b: number }) => {
      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const colorRgb = hexToRgb(color);
    const bgRgb = hexToRgb(bgColor);
    if (!colorRgb || !bgRgb) return false;

    const colorLum = getLuminance(colorRgb);
    const bgLum = getLuminance(bgRgb);
    const contrast = (Math.max(colorLum, bgLum) + 0.05) / (Math.min(colorLum, bgLum) + 0.05);

    return contrast < 4.5; // WCAG AA minimum
  };

  const colorFields: Array<{ key: keyof DesignPalette; label: string; contrastWith?: keyof DesignPalette }> = [
    { key: "primaryColor", label: "Primary", contrastWith: "backgroundColor" },
    { key: "backgroundColor", label: "Background" },
    { key: "titleColor", label: "Title", contrastWith: "backgroundColor" },
    { key: "descriptionColor", label: "Description", contrastWith: "backgroundColor" },
  ];

  return (
    <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
          Global Design Palette
        </h3>
        <Tooltip content="Changes apply to all components using these colors">
          <span className="text-xs text-[oklch(0.5200_0.015_25)]">Global</span>
        </Tooltip>
      </div>

      <div className="space-y-3">
        {colorFields.map((field) => {
          const value = designPalette[field.key] as string;
          const contrastWarning =
            field.contrastWith &&
            getContrastWarning(value, designPalette[field.contrastWith] as string);

          return (
            <div key={field.key}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                  {field.label}
                </label>
                <div className="flex items-center gap-1">
                  {contrastWarning && (
                    <Tooltip content="Low contrast - may affect readability">
                      <span className="text-[oklch(0.5500_0.26_15)] text-xs">⚠</span>
                    </Tooltip>
                  )}
                  <button
                    onClick={() => copyColor(value)}
                    className="p-1 hover:bg-[oklch(0.9600_0.008_30)] rounded transition-colors"
                    title="Copy hex"
                  >
                    {copied === value ? (
                      <Check className="h-3 w-3 text-[oklch(0.6500_0.16_160)]" />
                    ) : (
                      <Copy className="h-3 w-3 text-[oklch(0.5200_0.015_25)]" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange(field.key, e.target.value)}
                  className="w-12 h-10 rounded-lg border border-[oklch(0.9200_0.005_20)] cursor-pointer"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleColorChange(field.key, e.target.value)}
                  className="flex-1 px-3 py-2 text-sm font-mono border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                  placeholder="#000000"
                />
                <Tooltip content="Eyedropper (coming soon)">
                  <button className="p-2 hover:bg-[oklch(0.9600_0.008_30)] rounded transition-colors">
                    <Pin className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
                  </button>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}





