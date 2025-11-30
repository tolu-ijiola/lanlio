import React from "react";
import { ComponentData } from "@/lib/editor-state";
import { useEditorStore } from "@/stores/editor-v2/store";
import { Monitor, Tablet, Smartphone } from "lucide-react";

export function StylePanel({ component }: { component: ComponentData }) {
  const { updateComponent, deviceView } = useEditorStore();
  
  // Determine which styles to edit based on device view
  const getStyles = () => {
    if (deviceView === "tablet") return (component as any).tabletStyles || {};
    if (deviceView === "mobile") return (component as any).mobileStyles || {};
    return (component as any).styles || {};
  };

  const styles = getStyles();
  const backgroundColor = styles.backgroundColor || "";
  const color = styles.color || "";
  const borderWidth = styles.borderWidth || "";
  const borderRadius = styles.borderRadius || "";

  const updateStyle = (key: string, value: string) => {
    const currentStyles = getStyles();
    const newStyles = { ...currentStyles, [key]: value };
    
    if (deviceView === "tablet") {
      updateComponent(component.id, { ...component, tabletStyles: newStyles } as any);
    } else if (deviceView === "mobile") {
      updateComponent(component.id, { ...component, mobileStyles: newStyles } as any);
    } else {
      updateComponent(component.id, { ...component, styles: newStyles } as any);
    }
  };

  const DeviceIcon = () => {
    if (deviceView === "tablet") return <Tablet className="w-3 h-3" />;
    if (deviceView === "mobile") return <Smartphone className="w-3 h-3" />;
    return <Monitor className="w-3 h-3" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1 pb-2 border-b border-[oklch(0.9200_0.005_20)]">
        <span className="text-xs text-[oklch(0.5200_0.015_25)] flex items-center gap-1">
          Editing for: <DeviceIcon /> <span className="capitalize">{deviceView}</span>
        </span>
      </div>

      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
          Colors
        </h3>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={backgroundColor || "#ffffff"}
                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                className="w-12 h-10 rounded-lg border border-[oklch(0.9200_0.005_20)] cursor-pointer"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                className="flex-1 px-3 py-2 text-sm font-mono border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                placeholder="#ffffff"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color || "#000000"}
                onChange={(e) => updateStyle("color", e.target.value)}
                className="w-12 h-10 rounded-lg border border-[oklch(0.9200_0.005_20)] cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => updateStyle("color", e.target.value)}
                className="flex-1 px-3 py-2 text-sm font-mono border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
          Border
        </h3>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1">Width</label>
            <input
              type="text"
              value={borderWidth}
              onChange={(e) => updateStyle("borderWidth", e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1">Radius</label>
            <input
              type="text"
              value={borderRadius}
              onChange={(e) => updateStyle("borderRadius", e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
