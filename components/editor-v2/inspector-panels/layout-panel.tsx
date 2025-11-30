"use client";

import React, { useState } from "react";
import { ComponentData } from "@/lib/editor-state";
import { useEditorStore } from "@/stores/editor-v2/store";
import { AlignVerticalJustifyCenter, AlignHorizontalJustifyCenter, Link2, Unlink, Monitor, Tablet, Smartphone } from "lucide-react";

export function LayoutPanel({ component }: { component: ComponentData }) {
  const { updateComponent, deviceView } = useEditorStore();
  
  // Determine which styles to edit based on device view
  const getStyles = () => {
    if (deviceView === "tablet") return (component as any).tabletStyles || {};
    if (deviceView === "mobile") return (component as any).mobileStyles || {};
    return (component as any).styles || {};
  };

  const styles = getStyles();
  const width = styles.width || "";
  const height = styles.height || "";
  
  // Padding values
  const paddingAll = styles.padding || "";
  const paddingTop = styles.paddingTop || "";
  const paddingRight = styles.paddingRight || "";
  const paddingBottom = styles.paddingBottom || "";
  const paddingLeft = styles.paddingLeft || "";
  const [paddingLinked, setPaddingLinked] = useState(true);
  
  // Margin values
  const marginAll = styles.margin || "";
  const marginTop = styles.marginTop || "";
  const marginRight = styles.marginRight || "";
  const marginBottom = styles.marginBottom || "";
  const marginLeft = styles.marginLeft || "";
  const [marginLinked, setMarginLinked] = useState(true);

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

  const updatePadding = (side: string, value: string) => {
    if (paddingLinked && side === "all") {
      updateStyle("padding", value);
      updateStyle("paddingTop", "");
      updateStyle("paddingRight", "");
      updateStyle("paddingBottom", "");
      updateStyle("paddingLeft", "");
    } else if (!paddingLinked) {
      if (side === "all") {
        updateStyle("padding", value);
      } else {
        updateStyle(`padding${side.charAt(0).toUpperCase() + side.slice(1)}`, value);
      }
    }
  };

  const updateMargin = (side: string, value: string) => {
    if (marginLinked && side === "all") {
      updateStyle("margin", value);
      updateStyle("marginTop", "");
      updateStyle("marginRight", "");
      updateStyle("marginBottom", "");
      updateStyle("marginLeft", "");
    } else if (!marginLinked) {
      if (side === "all") {
        updateStyle("margin", value);
      } else {
        updateStyle(`margin${side.charAt(0).toUpperCase() + side.slice(1)}`, value);
      }
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
          Size
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1">Width</label>
            <input
              type="text"
              value={width}
              onChange={(e) => updateStyle("width", e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
              placeholder="Auto"
            />
          </div>
          <div>
            <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1">Height</label>
            <input
              type="text"
              value={height}
              onChange={(e) => updateStyle("height", e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
              placeholder="Auto"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            Padding
          </h3>
          <button
            onClick={() => setPaddingLinked(!paddingLinked)}
            className={`p-1 rounded transition-colors ${
              paddingLinked
                ? "bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)]"
                : "text-[oklch(0.5200_0.015_25)] hover:bg-[oklch(0.9600_0.008_30)]"
            }`}
            title={paddingLinked ? "Unlink sides" : "Link sides"}
          >
            {paddingLinked ? <Link2 className="h-3 w-3" /> : <Unlink className="h-3 w-3" />}
          </button>
        </div>
        {paddingLinked ? (
          <div>
            <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1">All Sides</label>
            <input
              type="text"
              value={paddingAll}
              onChange={(e) => updatePadding("all", e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
              placeholder="0"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1 flex items-center gap-1">
                <AlignVerticalJustifyCenter className="h-3 w-3" />
                Top
              </label>
              <input
                type="text"
                value={paddingTop}
                onChange={(e) => updatePadding("top", e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1 flex items-center gap-1">
                <AlignVerticalJustifyCenter className="h-3 w-3 rotate-180" />
                Bottom
              </label>
              <input
                type="text"
                value={paddingBottom}
                onChange={(e) => updatePadding("bottom", e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1 flex items-center gap-1">
                <AlignHorizontalJustifyCenter className="h-3 w-3 rotate-90" />
                Left
              </label>
              <input
                type="text"
                value={paddingLeft}
                onChange={(e) => updatePadding("left", e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1 flex items-center gap-1">
                <AlignHorizontalJustifyCenter className="h-3 w-3 -rotate-90" />
                Right
              </label>
              <input
                type="text"
                value={paddingRight}
                onChange={(e) => updatePadding("right", e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                placeholder="0"
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            Margin
          </h3>
          <button
            onClick={() => setMarginLinked(!marginLinked)}
            className={`p-1 rounded transition-colors ${
              marginLinked
                ? "bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)]"
                : "text-[oklch(0.5200_0.015_25)] hover:bg-[oklch(0.9600_0.008_30)]"
            }`}
            title={marginLinked ? "Unlink sides" : "Link sides"}
          >
            {marginLinked ? <Link2 className="h-3 w-3" /> : <Unlink className="h-3 w-3" />}
          </button>
        </div>
        {marginLinked ? (
          <div>
            <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1">All Sides</label>
            <input
              type="text"
              value={marginAll}
              onChange={(e) => updateMargin("all", e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
              placeholder="0"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1 flex items-center gap-1">
                <AlignVerticalJustifyCenter className="h-3 w-3" />
                Top
              </label>
              <input
                type="text"
                value={marginTop}
                onChange={(e) => updateMargin("top", e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1 flex items-center gap-1">
                <AlignVerticalJustifyCenter className="h-3 w-3 rotate-180" />
                Bottom
              </label>
              <input
                type="text"
                value={marginBottom}
                onChange={(e) => updateMargin("bottom", e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1 flex items-center gap-1">
                <AlignHorizontalJustifyCenter className="h-3 w-3 rotate-90" />
                Left
              </label>
              <input
                type="text"
                value={marginLeft}
                onChange={(e) => updateMargin("left", e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1 flex items-center gap-1">
                <AlignHorizontalJustifyCenter className="h-3 w-3 -rotate-90" />
                Right
              </label>
              <input
                type="text"
                value={marginRight}
                onChange={(e) => updateMargin("right", e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                placeholder="0"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
