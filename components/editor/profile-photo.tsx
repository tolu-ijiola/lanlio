import React, { useRef } from "react";
import { User, Upload, X } from "lucide-react";
import { ProfilePhotoComponentData, ComponentData } from "@/lib/editor-state";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { AlignmentControl } from "../ui/alignment-control";

interface ProfilePhotoProps {
  data: ProfilePhotoComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

const SIZE_MAP: Record<NonNullable<ProfilePhotoComponentData["size"]>, number> = {
  sm: 120,
  md: 160,
  lg: 200,
};

export default function ProfilePhoto({ data, isPreviewMode, onUpdate }: ProfilePhotoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const alignment = data.alignment || "center";
  const alignClass =
    alignment === "left" ? "justify-start" : alignment === "right" ? "justify-end" : "justify-center";
  const rounded = data.rounded || "full";
  const size = SIZE_MAP[data.size || "md"];
  const showBadge = data.showBadge ?? true;
  const badgeColor = data.badgeColor || "oklch(0.72 0.2 150)";

  const borderRadius =
    rounded === "full" ? "9999px" : rounded === "small" ? "1.25rem" : "0.75rem";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({
          ...data,
          image: reader.result as string,
        } as ComponentData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onUpdate({ ...data, image: '' } as ComponentData);
  };

  // Edit mode - show upload controls
  if (!isPreviewMode) {
    return (
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">Profile Photo</label>
          {data.image ? (
            <div className="relative inline-block">
              <img
                src={data.image}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full border border-border"
                style={{ borderRadius }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-0 right-0 h-6 w-6 rounded-full p-0"
                onClick={handleRemoveImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-full p-6 text-center w-32 h-32 flex flex-col items-center justify-center">
              <User className="h-8 w-8 mb-2 text-muted-foreground" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-3 w-3 mr-1" />
                Upload
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          )}
        </div>
        {data.image && (
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Image URL</label>
            <Input
              type="text"
              value={data.image || ''}
              onChange={(e) => onUpdate({ ...data, image: e.target.value } as ComponentData)}
              placeholder="Or paste image URL"
              className="w-full h-9 text-sm"
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Size</label>
            <select
              value={data.size || 'md'}
              onChange={(e) => onUpdate({ ...data, size: e.target.value as any } as ComponentData)}
              className="w-full px-2.5 py-1.5 text-xs border border-border rounded-md bg-background h-9"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Shape</label>
            <select
              value={data.rounded || 'full'}
              onChange={(e) => onUpdate({ ...data, rounded: e.target.value as any } as ComponentData)}
              className="w-full px-2.5 py-1.5 text-xs border border-border rounded-md bg-background h-9"
            >
              <option value="full">Circle</option>
              <option value="small">Rounded</option>
              <option value="none">Square</option>
            </select>
          </div>
        </div>
        
        <div>
          <AlignmentControl
            value={data.alignment || 'center'}
            onChange={(value) => {
              onUpdate({ ...data, alignment: value as any } as ComponentData);
            }}
            label="Alignment"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-foreground">Show Badge</label>
            <Switch
              checked={data.showBadge ?? true}
              onCheckedChange={(checked) => {
                onUpdate({ ...data, showBadge: checked } as ComponentData);
              }}
            />
          </div>
          {data.showBadge !== false && (
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Badge Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.badgeColor || "#4ade80"}
                  onChange={(e) => onUpdate({ ...data, badgeColor: e.target.value } as ComponentData)}
                  className="w-10 h-9 rounded border border-border cursor-pointer"
                />
                <Input
                  type="text"
                  value={data.badgeColor || ""}
                  onChange={(e) => onUpdate({ ...data, badgeColor: e.target.value } as ComponentData)}
                  placeholder="#4ade80"
                  className="flex-1 h-9 text-xs font-mono"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const imageContent = data.image ? (
    <img
      src={data.image}
      alt="Profile"
      className="w-full h-full object-cover"
      style={{ borderRadius }}
    />
  ) : (
    <div
      className="w-full h-full flex flex-col items-center justify-center text-[oklch(0.5200_0.015_25)] bg-[oklch(0.9600_0.008_30)]"
      style={{ borderRadius }}
    >
      <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center mb-2">
        <User className="h-6 w-6" />
      </div>
      <p className="text-xs font-medium">Profile Photo</p>
    </div>
  );

  return (
    <div className={`flex ${alignClass}`} data-editor-component>
      <div
        className="relative shadow-[0_10px_35px_rgba(15,23,42,0.08)] bg-white/80 border border-[oklch(0.9200_0.005_20)] backdrop-blur"
        style={{
          borderRadius,
          width: size,
          height: size,
        }}
      >
        <div className="absolute inset-0" style={{ borderRadius }}>
          {imageContent}
        </div>
        {showBadge && (
          <span
            className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md"
            style={{
              backgroundColor: badgeColor,
              bottom: rounded === "full" ? 10 : 8,
              right: rounded === "full" ? 10 : 8,
            }}
          />
        )}
      </div>
    </div>
  );
}



