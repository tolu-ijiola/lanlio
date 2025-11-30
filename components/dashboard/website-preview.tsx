"use client";

import Image from "next/image";
import { Website } from "@/lib/supabase/types";
import { getWebsitePreviewUrl } from "@/lib/utils/preview";

interface WebsitePreviewProps {
  website: Website;
  className?: string;
}

export function WebsitePreview({ website, className = "" }: WebsitePreviewProps) {
  const previewUrl = getWebsitePreviewUrl(website);

  if (previewUrl) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <Image
          src={previewUrl}
          alt={website.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }

  // Fallback: Show a preview based on design palette
  const primaryColor = website.design_palette?.primaryColor || "#000000";
  
  // Extract color values for gradient
  const getColorFromHex = (hex: string) => {
    // Remove # if present
    const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;
    
    // Handle 3-digit hex codes
    if (cleanHex.length === 3) {
      const r = parseInt(cleanHex[0] + cleanHex[0], 16);
      const g = parseInt(cleanHex[1] + cleanHex[1], 16);
      const b = parseInt(cleanHex[2] + cleanHex[2], 16);
      return { r, g, b };
    }
    
    // Handle 6-digit hex codes
    const r = parseInt(cleanHex.slice(0, 2), 16) || 0;
    const g = parseInt(cleanHex.slice(2, 4), 16) || 0;
    const b = parseInt(cleanHex.slice(4, 6), 16) || 0;
    return { r, g, b };
  };

  const primary = getColorFromHex(primaryColor);

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center ${className}`}
      style={{
        background: `linear-gradient(135deg, rgba(${primary.r}, ${primary.g}, ${primary.b}, 0.2) 0%, rgba(${primary.r}, ${primary.g}, ${primary.b}, 0.05) 100%)`,
      }}
    >
      <div
        className="text-3xl md:text-4xl font-bold"
        style={{ color: primaryColor }}
      >
        {website.name.charAt(0).toUpperCase()}
      </div>
    </div>
  );
}

