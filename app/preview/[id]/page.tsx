"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getWebsiteById } from "@/lib/supabase/websites";
import { Website } from "@/lib/supabase/types";
import { ComponentData, DesignPalette } from "@/lib/editor-state";
import { getComponent, componentRegistry, ComponentType } from "@/lib/component-registry";
import { cn } from "@/lib/utils";

export default function PreviewWebsitePage() {
  const params = useParams();
  const websiteId = params.id as string;
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWebsite() {
      if (!websiteId) {
        setLoading(false);
        return;
      }

      const data = await getWebsiteById(websiteId);
      setWebsite(data);
      setLoading(false);
    }

    loadWebsite();
  }, [websiteId]);

  // Apply design palette and hide scrollbars
  useEffect(() => {
    if (!website) return;

    const root = document.documentElement;
    const palette = website.design_palette;
    
    root.style.setProperty('--palette-primary', palette.primaryColor);
    root.style.setProperty('--palette-bg', palette.backgroundColor);
    root.style.setProperty('--palette-title', palette.titleColor);
    root.style.setProperty('--palette-description', palette.descriptionColor);
    root.style.setProperty('--palette-font', palette.fontFamily);
    root.style.setProperty('--palette-radius', palette.borderRadius);

    // Load Google Font
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${palette.fontFamily.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
    link.rel = 'stylesheet';
    if (!document.head.querySelector(`link[href*="${palette.fontFamily}"]`)) {
      document.head.appendChild(link);
    }

    // Apply border radius as default (but allow components to override)
    const styleId = 'design-palette-radius';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    // Only apply to elements that don't have explicit border-radius set
    // This allows image components and other components to use their own border-radius
    styleEl.textContent = `
      [data-editor-component] {
        --default-radius: ${palette.borderRadius};
      }
    `;

    // Hide all scrollbars
    const scrollbarStyleId = 'hide-scrollbars';
    let scrollbarStyle = document.getElementById(scrollbarStyleId) as HTMLStyleElement;
    if (!scrollbarStyle) {
      scrollbarStyle = document.createElement('style');
      scrollbarStyle.id = scrollbarStyleId;
      document.head.appendChild(scrollbarStyle);
    }
    scrollbarStyle.textContent = `
      html, body, * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar {
        width: 0px !important;
        height: 0px !important;
        display: none !important;
      }
    `;

    return () => {
      // Cleanup scrollbar style on unmount
      const cleanup = document.getElementById(scrollbarStyleId);
      if (cleanup) cleanup.remove();
    };
  }, [website]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading website...</p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Website Not Found</h1>
          <p className="text-muted-foreground">
            The website you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-background overflow-x-hidden" 
      style={{ 
        fontFamily: `var(--palette-font, sans-serif)`, 
        overscrollBehaviorX: 'none',
      }}
    >
      {/* SEO Meta Tags */}
      <head>
        <title>{website.seo_settings?.title || website.title}</title>
        <meta name="description" content={website.seo_settings?.description || website.description || ''} />
        {website.seo_settings?.ogImage && (
          <meta property="og:image" content={website.seo_settings.ogImage} />
        )}
        {website.seo_settings?.canonicalUrl && (
          <link rel="canonical" href={website.seo_settings.canonicalUrl} />
        )}
      </head>

      {/* Professional Inspector Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-muted/30 w-full">
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-12 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span>Preview</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs">Built with lanlio</span>
              <a 
                href="/register" 
                className="px-3 py-1.5 text-xs border border-border bg-background hover:bg-muted transition-colors rounded"
              >
                Create yours
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Render Components */}
      <div className="w-full overflow-x-hidden pt-12 max-w-5xl mx-auto space-y-6" style={{ overscrollBehaviorX: 'none' }}>
        {website.components
          .filter((componentData: ComponentData) => (componentData as any).type !== 'layout')
          .map((componentData: ComponentData) => {     
          const Component = getComponent(componentData.type as ComponentType);
          const metadata = componentRegistry[componentData.type as ComponentType];
          
          const isEditable = [
            'header', 'text', 'button', 'image', 'video', 'profile',
            'gallery', 'skills', 'experience', 'services', 'pricing', 'spacer',
            'award', 'review', 'contact-form', 'contact-details', 'languages', 'github', 'spotify', 
            'link-block', 'projects', 'profile-photo', 'tools', 'social-media', 'navigation', 'divider'
          ].includes(componentData.type);
          
          if (!isEditable) return null;
          
          const EditableComponent = Component as React.ComponentType<{
            data: ComponentData;
            isPreviewMode: boolean;
            onUpdate: (data: ComponentData) => void;
          }>;
          
          // Add padding and max-width to all components except images
          const isImage = componentData.type === 'image' || componentData.type === 'gallery';
          const isFullWidth = componentData.type === 'image' || componentData.type === 'gallery' || componentData.type === 'video';
          const isGallery = componentData.type === 'gallery';
          
          return (
            <div 
              key={componentData.id} 
              data-editor-component
              className={cn(
                !isImage && "px-1 sm:px-2",
                !isFullWidth && "max-w-4xl mx-auto",
                isGallery && "max-w-6xl mx-auto"
              )}
            >
              <EditableComponent 
                data={componentData} 
                isPreviewMode={true}
                onUpdate={() => {}} // No-op in public view
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

