import React from "react";
import { Input } from "../ui/input";
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
    <div 
      className="w-full flex items-center justify-center bg-[oklch(0.9600_0.008_30)]/30 border border-dashed border-[oklch(0.9200_0.005_20)] rounded-lg transition-all hover:bg-[oklch(0.9600_0.008_30)]"
      style={{ 
        height: data.height || '2rem',
        minHeight: data.height || '2rem',
      }}
    >
      <span className="text-[10px] text-[oklch(0.5200_0.015_25)] opacity-0 group-hover:opacity-100 transition-opacity select-none">
        Spacer ({data.height || '2rem'})
      </span>
    </div>
  );
}

export default Spacer;

