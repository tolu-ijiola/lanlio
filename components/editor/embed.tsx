"use client";

import React from "react";
import { EmbedComponentData, ComponentData } from "@/lib/editor-state";
import { Globe } from "lucide-react";
import { Input } from "../ui/input";

interface EmbedProps {
  data: EmbedComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

export default function EmbedComponent({
  data,
  isPreviewMode,
  onUpdate,
}: EmbedProps) {
  const { url, title } = data;

  if (isPreviewMode) {
    if (!url) {
      return (
        <div className="w-full h-64 bg-muted border border-dashed border-border rounded-xl flex flex-col items-center justify-center">
          <Globe className="h-8 w-8 mb-2 text-muted-foreground opacity-50" />
          <p className="text-sm font-medium text-muted-foreground">Embed URL</p>
          <p className="text-xs text-muted-foreground opacity-70">Enter a URL in the properties panel</p>
        </div>
      );
    }

    return (
      <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-border bg-background">
        <iframe
          src={url}
          title={title || "Embed"}
          className="w-full h-full min-h-[inherit] border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Embed URL"
        value={url || ""}
        onChange={(e) => onUpdate({ ...data, url: e.target.value })}
        className="h-12"
      />
      <Input
        placeholder="Title (Optional)"
        value={title || ""}
        onChange={(e) => onUpdate({ ...data, title: e.target.value })}
        className="h-12"
      />
      {url && (
        <div className="w-full h-64 rounded-xl overflow-hidden border border-border bg-background">
          <iframe
            src={url}
            title={title || "Embed"}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}
    </div>
  );
}
