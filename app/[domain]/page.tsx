"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getWebsiteByDomain } from "@/lib/supabase/websites";
import { Website } from "@/lib/supabase/types";
import { ComponentData, DesignPalette } from "@/lib/editor-state";
import { getComponent, componentRegistry, ComponentType } from "@/lib/component-registry";
import { cn } from "@/lib/utils";

export default function PublicWebsitePage() {
  const params = useParams();
  const domain = params.domain as string;
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWebsite() {
      if (!domain) {
        setLoading(false);
        return;
      }

      const fullDomain = domain.includes('.') ? domain : `${domain}.website.ai`;
      
      // Try to fetch published website first
      let data = await getWebsiteByDomain(fullDomain);

      // If not found or not published, check if user is owner and it's a draft
      if (!data) {
        // Import local supabase client
        const { supabase } = await import("@/lib/supabase/client");
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: draftSite } = await supabase
            .from('websites')
            .select('*')
            .eq('domain', fullDomain)
            .eq('user_id', user.id)
            .single();
            
          if (draftSite) {
            data = draftSite;
          }
        }
      }

      setWebsite(data);
      setLoading(false);
    }

    loadWebsite();
  }, [domain]);

  // Apply design palette
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
            The website you're looking for doesn't exist or is not published.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: `var(--palette-font, sans-serif)` }}>
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
      <div className="border-b border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span>Live</span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <span className="text-[10px] opacity-70">{website.domain}</span>
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
      <div className="w-full max-w-5xl mx-auto space-y-6">
        {website.components
          .filter((componentData: ComponentData) => (componentData as any).type !== 'layout')
          .map((componentData: ComponentData) => {     
          const Component = getComponent(componentData.type as ComponentType);
          const metadata = componentRegistry[componentData.type as ComponentType];
          
          const isEditable = [
            'header', 'text', 'button', 'image', 'video', 'profile',
            'gallery', 'skills', 'experience', 'services', 'pricing', 'spacer',
            'award', 'review', 'contact-form', 'contact-details', 'languages', 'github', 'spotify', 
            'link-block', 'projects', 'profile-photo', 'tools', 'social-media', 'divider'
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





