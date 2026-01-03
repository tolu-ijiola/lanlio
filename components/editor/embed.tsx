"use client";

import React, { useState } from "react";
import { EmbedComponentData, ComponentData } from "@/lib/editor-state";
import { Globe, MapPin, Code } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { MetricInput } from "../ui/metric-input";

interface EmbedProps {
  data: EmbedComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

// Create a sandboxed iframe with the code isolated
const createSandboxedIframe = (code: string): string => {
  // Create a complete HTML document with the code
  // This ensures the code runs in complete isolation
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      width: 100%;
      min-height: 100vh;
      overflow: auto;
    }
  </style>
</head>
<body>
  ${code}
</body>
</html>
  `.trim();
  
  // Convert to data URL for iframe src
  return `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
};

// Sanitize code to remove potentially malicious content (additional safety layer)
const sanitizeCode = (code: string): string => {
  // Remove script tags that might try to access parent
  let sanitized = code.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers that might try to access parent
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove window.parent, window.top, window.opener references
  sanitized = sanitized.replace(/window\.(parent|top|opener)/gi, '');
  
  return sanitized;
};

// Convert address to Google Maps embed URL
const convertAddressToMapUrl = (address: string): string => {
  if (!address.trim()) return '';
  const encodedAddress = encodeURIComponent(address.trim());
  // Use Google Maps embed URL (no API key required for basic embeds)
  return `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
};

export default function EmbedComponent({
  data,
  isPreviewMode,
  onUpdate,
}: EmbedProps) {
  // Handle undefined data - in edit mode, show controls; in preview, show placeholder
  if (!data) {
    if (!isPreviewMode) {
      // In edit mode, create default data structure
      const defaultData: EmbedComponentData = {
        id: '',
        type: 'embed',
        embedType: 'website',
        url: '',
      };
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Embed Type</Label>
            <Select
              value="website"
              onValueChange={(value: 'website' | 'map' | 'code') => {
                onUpdate({ ...defaultData, embedType: value });
              }}
            >
              <SelectTrigger className="h-9 text-xs w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5" />
                    <span>Website</span>
                  </div>
                </SelectItem>
                <SelectItem value="map">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Map</span>
                  </div>
                </SelectItem>
                <SelectItem value="code">
                  <div className="flex items-center gap-2">
                    <Code className="h-3.5 w-3.5" />
                    <span>Code</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="block text-xs font-medium text-foreground mb-1.5">Embed URL</Label>
            <Input
              type="url"
              value=""
              onChange={(e) => onUpdate({ ...defaultData, url: e.target.value })}
              placeholder="Paste embed URL (iframe src)"
              className="w-full h-9 text-sm"
            />
          </div>
        </div>
      );
    }
    return (
      <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-border bg-muted flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No embed content provided</p>
      </div>
    );
  }

  const embedType = data.embedType || 'website';
  const { url, code, mapAddress, width, height } = data || { url: '', code: '', mapAddress: '', width: '', height: '' };

  // Edit mode - show controls based on embed type
  if (!isPreviewMode) {
    return (
      <div className="space-y-4">
        {/* Embed Type Selector */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Embed Type</Label>
          <Select
            value={embedType}
            onValueChange={(value: 'website' | 'map' | 'code') => {
              onUpdate({ ...data, embedType: value });
            }}
          >
            <SelectTrigger className="h-9 text-xs w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5" />
                  <span>Website</span>
                </div>
              </SelectItem>
              <SelectItem value="map">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Map</span>
                </div>
              </SelectItem>
              <SelectItem value="code">
                <div className="flex items-center gap-2">
                  <Code className="h-3.5 w-3.5" />
                  <span>Code</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Width and Height Controls */}
        <div className="grid grid-cols-2 gap-3">
          <MetricInput
            label="Width"
            value={width || ''}
            onChange={(value) => onUpdate({ ...data, width: value })}
            placeholder="100%"
          />
          <MetricInput
            label="Height"
            value={height || ''}
            onChange={(value) => onUpdate({ ...data, height: value })}
            placeholder="300px"
          />
        </div>

        {/* Website Type */}
        {embedType === 'website' && (
          <div className="space-y-3">
            <div>
              <Label className="block text-xs font-medium text-foreground mb-1.5">Embed URL</Label>
              <Input
                type="url"
                value={url || ''}
                onChange={(e) => onUpdate({ ...data, url: e.target.value })}
                placeholder="Paste embed URL (iframe src)"
                className="w-full h-9 text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Paste the embed URL (iframe src) from any service
              </p>
            </div>
            {url && (
              <div className="relative group">
                {/* Ruler indicator */}
                <div className="absolute -top-3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary/30" />
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-px h-2 bg-primary/40" />
                
                <div 
                  className="relative border border-border/50 rounded-lg overflow-hidden bg-background shadow-sm hover:shadow-md transition-shadow"
                  style={{ 
                    width: width || '100%',
                    height: height || 'auto',
                    minHeight: height ? undefined : '300px'
                  }}
                >
                  {/* Type indicator - only in edit mode */}
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/90 backdrop-blur-sm border border-border/50 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    <span className="font-mono">embed</span>
                  </div>
                  
                  <div className="w-full h-full overflow-hidden" style={{ minHeight: height ? undefined : '300px' }}>
                    <iframe
                      src={url}
                      title="Embed"
                      className="w-full h-full border-0"
                      style={{ minHeight: height ? undefined : '300px' }}
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Map Type */}
        {embedType === 'map' && (
          <div className="space-y-3">
            <div>
              <Label className="block text-xs font-medium text-foreground mb-1.5">Address or Location</Label>
              <Input
                type="text"
                value={mapAddress || ''}
                onChange={(e) => {
                  const address = e.target.value;
                  const mapUrl = convertAddressToMapUrl(address);
                  onUpdate({ ...data, mapAddress: address, url: mapUrl });
                }}
                placeholder="Enter address or location (e.g., 'New York, NY' or '1600 Amphitheatre Parkway, Mountain View, CA')"
                className="w-full h-9 text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Enter an address or location to display on Google Maps
              </p>
            </div>
            {mapAddress && (
              <div className="relative group">
                {/* Ruler indicator */}
                <div className="absolute -top-3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary/30" />
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-px h-2 bg-primary/40" />
                
                <div 
                  className="relative border border-border/50 rounded-lg overflow-hidden bg-background shadow-sm hover:shadow-md transition-shadow"
                  style={{ 
                    width: width || '100%',
                    height: height || 'auto',
                    minHeight: height ? undefined : '300px'
                  }}
                >
                  {/* Type indicator - only in edit mode */}
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/90 backdrop-blur-sm border border-border/50 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="font-mono">map</span>
                  </div>
                  
                  <div className="w-full h-full overflow-hidden" style={{ minHeight: height ? undefined : '300px' }}>
                    <iframe
                      src={convertAddressToMapUrl(mapAddress)}
                      title="Map"
                      className="w-full h-full border-0"
                      style={{ minHeight: height ? undefined : '300px' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Code Type */}
        {embedType === 'code' && (
          <div className="space-y-3">
            <div>
              <Label className="block text-xs font-medium text-foreground mb-1.5">HTML Code</Label>
              <Textarea
                value={code || ''}
                onChange={(e) => {
                  const sanitized = sanitizeCode(e.target.value);
                  onUpdate({ ...data, code: sanitized });
                }}
                placeholder="Paste your HTML code here..."
                className="w-full min-h-[200px] text-sm font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Paste HTML code. Script tags and event handlers are automatically removed for security.
              </p>
            </div>
            {code && (
              <div className="relative group">
                {/* Ruler indicator */}
                <div className="absolute -top-3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary/30" />
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-px h-2 bg-primary/40" />
                
                <div 
                  className="relative border border-border/50 rounded-lg overflow-hidden bg-background shadow-sm hover:shadow-md transition-shadow"
                  style={{ 
                    width: width || '100%',
                    height: height || 'auto',
                    minHeight: height ? undefined : '200px'
                  }}
                >
                  {/* Type indicator - only in edit mode */}
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/90 backdrop-blur-sm border border-border/50 text-xs text-muted-foreground">
                    <Code className="h-3 w-3" />
                    <span className="font-mono">code</span>
                  </div>
                  
                  <div className="w-full h-full overflow-hidden" style={{ minHeight: height ? undefined : '200px' }}>
                    <iframe
                      src={createSandboxedIframe(sanitizeCode(code))}
                      className="w-full h-full border-0"
                      style={{ minHeight: height ? undefined : '200px' }}
                      sandbox="allow-same-origin allow-scripts allow-forms"
                      title="Embedded Code"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Preview mode - render based on embed type with unique styling
  if (embedType === 'code') {
    if (!code) {
      return (
        <div className="relative w-full min-h-[300px] rounded-lg overflow-hidden border border-border/50 bg-muted/30 flex items-center justify-center">
          <p className="text-muted-foreground text-sm font-mono">No code provided</p>
        </div>
      );
    }
    return (
      <div className="relative group">
        {/* Ruler indicator */}
        <div className="absolute -top-3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary/30" />
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-px h-2 bg-primary/40" />
        
        <div 
          className="relative border border-border/50 rounded-lg overflow-hidden bg-background shadow-sm"
          style={{ 
            width: width || '100%',
            height: height || 'auto',
            minHeight: height ? undefined : '300px'
          }}
        >
          {/* No badge in preview mode - code is isolated in iframe */}
          <div className="w-full h-full overflow-hidden" style={{ minHeight: height ? undefined : '300px' }}>
            <iframe
              src={createSandboxedIframe(sanitizeCode(code))}
              className="w-full h-full border-0"
              style={{ minHeight: height ? undefined : '300px' }}
              sandbox="allow-same-origin allow-scripts allow-forms"
              title="Embedded Code"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    );
  }

  if (embedType === 'map') {
    if (!mapAddress) {
      return (
        <div className="relative w-full min-h-[300px] rounded-lg overflow-hidden border border-border/50 bg-muted/30 flex items-center justify-center">
          <p className="text-muted-foreground text-sm font-mono">No address provided</p>
        </div>
      );
    }
    return (
      <div className="relative group">
        {/* Ruler indicator */}
        <div className="absolute -top-3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary/30" />
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-px h-2 bg-primary/40" />
        
        <div 
          className="relative border border-border/50 rounded-lg overflow-hidden bg-background shadow-sm"
          style={{ 
            width: width || '100%',
            height: height || 'auto',
            minHeight: height ? undefined : '300px'
          }}
        >
          {/* No badge in preview mode */}
          <div className="w-full h-full overflow-hidden" style={{ minHeight: height ? undefined : '300px' }}>
            <iframe
              src={convertAddressToMapUrl(mapAddress)}
              title="Map"
              className="w-full h-full border-0"
              style={{ minHeight: height ? undefined : '300px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    );
  }

  // Website type (default)
  if (!url) {
    return (
      <div className="relative w-full min-h-[300px] rounded-lg overflow-hidden border border-border/50 bg-muted/30 flex items-center justify-center">
        <p className="text-muted-foreground text-sm font-mono">No embed URL provided</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Ruler indicator */}
      <div className="absolute -top-3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary/30" />
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-px h-2 bg-primary/40" />
      
      <div 
        className="relative border border-border/50 rounded-lg overflow-hidden bg-background shadow-sm"
        style={{ 
          width: width || '100%',
          height: height || 'auto',
          minHeight: height ? undefined : '300px'
        }}
      >
        {/* No badge in preview mode */}
        <div className="w-full h-full overflow-hidden" style={{ minHeight: height ? undefined : '300px' }}>
          <iframe
            src={url}
            title="Embed"
            className="w-full h-full border-0"
            style={{ minHeight: height ? undefined : '300px' }}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </div>
    </div>
  );
}
