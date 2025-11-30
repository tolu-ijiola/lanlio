"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Globe } from "lucide-react";

export interface SEOSettings {
  title: string;
  description: string;
  ogImage: string;
  canonicalUrl: string;
}

interface SEOSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seo: SEOSettings;
  onUpdate: (seo: SEOSettings) => void;
}

const defaultSEO: SEOSettings = {
  title: "",
  description: "",
  ogImage: "",
  canonicalUrl: "",
};

export default function SEOSettingsComponent({
  open,
  onOpenChange,
  seo,
  onUpdate,
}: SEOSettingsProps) {
  const [localSEO, setLocalSEO] = React.useState<SEOSettings>(seo || defaultSEO);

  React.useEffect(() => {
    if (open) {
      setLocalSEO(seo || defaultSEO);
    }
  }, [open, seo]);

  const handleUpdate = (field: keyof SEOSettings, value: string) => {
    const updated = { ...localSEO, [field]: value };
    setLocalSEO(updated);
    onUpdate(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="size-5" />
            SEO & Meta Settings
          </DialogTitle>
          <DialogDescription>
            Optimize your website for search engines and social media sharing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Search Engine Preview */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-3">Search Engine Preview</p>
            <div className="space-y-1">
              <div className="text-lg text-blue-600 hover:underline cursor-pointer line-clamp-1">
                {localSEO.title || "Page Title"}
              </div>
              <div className="text-sm text-green-700 line-clamp-1">
                {localSEO.canonicalUrl || "https://yourwebsite.com"}
              </div>
              <div className="text-sm text-foreground line-clamp-2">
                {localSEO.description || "Meta description will appear here..."}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="seo-title" className="text-xs">Page Title *</Label>
              <Input
                id="seo-title"
                value={localSEO.title}
                onChange={(e) => handleUpdate("title", e.target.value)}
                placeholder="My Portfolio - John Doe"
                maxLength={60}
                className="h-9 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                {localSEO.title.length}/60
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="seo-canonical" className="text-xs">Canonical URL *</Label>
              <Input
                id="seo-canonical"
                value={localSEO.canonicalUrl}
                onChange={(e) => handleUpdate("canonicalUrl", e.target.value)}
                placeholder="https://yourwebsite.com"
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="seo-description" className="text-xs">Meta Description *</Label>
            <Textarea
              id="seo-description"
              value={localSEO.description}
              onChange={(e) => handleUpdate("description", e.target.value)}
              placeholder="A brief description of your website..."
              rows={2}
              maxLength={160}
              className="text-sm resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {localSEO.description.length}/160
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="og-image" className="text-xs">OG Image URL *</Label>
            <Input
              id="og-image"
              value={localSEO.ogImage}
              onChange={(e) => handleUpdate("ogImage", e.target.value)}
              placeholder="https://yourwebsite.com/og-image.jpg"
              className="h-9 text-sm"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

