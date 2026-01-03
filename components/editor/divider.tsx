import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { MetricInput } from "../ui/metric-input";
import { AlignmentControl } from "../ui/alignment-control";
import { ComponentData } from "@/lib/editor-state";

interface DividerProps {
  data: ComponentData;
  isPreviewMode?: boolean;
  onUpdate?: (data: ComponentData) => void;
}

function Divider({ data, isPreviewMode = true, onUpdate }: DividerProps) {
  // Safely access data properties with defaults
  const dividerData = data || {};
  const color = (dividerData as any)?.color || "#e2e8f0";
  const thickness = (dividerData as any)?.thickness || "1px";
  const style = (dividerData as any)?.style || "solid";
  const width = (dividerData as any)?.width || "100%";
  const alignment = (dividerData as any)?.alignment || "left";

  const handleUpdate = (updates: any) => {
    if (onUpdate) {
      onUpdate({ ...data, ...updates });
    }
  };

  const getAlignmentClass = () => {
    if (alignment === 'center') return 'mx-auto';
    if (alignment === 'right') return 'ml-auto';
    return 'mr-auto';
  };

  // Edit mode
  if (!isPreviewMode && onUpdate) {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => handleUpdate({ color: e.target.value })}
                className="w-9 h-9 rounded border border-border cursor-pointer"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => handleUpdate({ color: e.target.value })}
                placeholder="#e2e8f0"
                className="flex-1 h-9 text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Style</Label>
            <Select
              value={style}
              onValueChange={(value) => handleUpdate({ style: value })}
            >
              <SelectTrigger className="h-9 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Thickness</Label>
            <div className="flex gap-1">
              <Input
                type="text"
                value={thickness.replace('px', '')}
                onChange={(e) => {
                  const numValue = e.target.value;
                  handleUpdate({ thickness: numValue ? `${numValue}px` : '1px' });
                }}
                placeholder="1"
                className="h-9 text-xs flex-1"
              />
              <select
                value="px"
                disabled
                className="h-9 px-2 text-xs border border-border rounded-md bg-muted cursor-not-allowed min-w-[60px]"
              >
                <option value="px">px</option>
              </select>
            </div>
          </div>

          <MetricInput
            label="Width"
            value={width}
            onChange={(value) => handleUpdate({ width: value })}
            placeholder="100%"
          />

          <div className="space-y-2">
            <AlignmentControl
              value={alignment}
              onChange={(value) => handleUpdate({ alignment: value as 'left' | 'center' | 'right' })}
              label="Alignment"
            />
          </div>
        </div>
      </div>
    );
  }

  // Preview mode
  return (
    <div className="py-4 w-full flex" style={{ justifyContent: alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start' }}>
      <hr
        style={{
          borderColor: color,
          borderTopWidth: thickness,
          borderStyle: style,
          width: width,
        }}
        className="border-0 border-t"
      />
    </div>
  );
}

export default Divider;













