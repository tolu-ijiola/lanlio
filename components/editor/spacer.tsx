import React from "react";
import { Input } from "../ui/input";
import { MetricInput } from "../ui/metric-input";
import { BaseComponentData, ComponentData } from "@/lib/editor-state";

interface SpacerComponentData extends BaseComponentData {
  type: 'spacer';
  height: string;
}

interface SpacerProps {
  data: SpacerComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function Spacer({ data, isPreviewMode, onUpdate }: SpacerProps) {
  const handleHeightChange = (height: string) => {
    onUpdate({ ...data, height });
  };

  if (isPreviewMode) {
    return (
      <div 
        style={{ 
          height: data.height || '2rem',
          minHeight: data.height || '1rem',
        }}
        className="[box-shadow:none!important]"
      />
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-foreground mb-2">Height</label>
        <MetricInput
          label=""
          value={data.height || '2rem'}
          onChange={(value) => handleHeightChange(value)}
          placeholder="2rem"
        />
      </div>
      <div 
        className="w-full border border-dashed border-border/50 rounded"
        style={{ 
          height: data.height || '2rem',
          minHeight: data.height || '2rem',
        }}
      />
    </div>
  );
}

export default Spacer;

