"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getWebsiteByDomain } from "@/lib/supabase/websites";
import { Website } from "@/lib/supabase/types";
import { ComponentData, DesignPalette } from "@/lib/editor-state";
import { getComponent } from "@/lib/component-registry";
import { componentRegistry } from "@/lib/component-registry";

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

    // Apply border radius
    const styleId = 'design-palette-radius';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      * {
        border-radius: ${palette.borderRadius} !important;
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
        <title>{website.seo_settings?.title || website.name}</title>
        <meta name="description" content={website.seo_settings?.description || website.description || ''} />
        {website.seo_settings?.ogImage && (
          <meta property="og:image" content={website.seo_settings.ogImage} />
        )}
        {website.seo_settings?.canonicalUrl && (
          <link rel="canonical" href={website.seo_settings.canonicalUrl} />
        )}
      </head>

      {/* Render Components */}
      <div className="w-full">
        {website.components.map((componentData: ComponentData) => {
          const Component = getComponent(componentData.type);
          const metadata = componentRegistry[componentData.type];
          
          const isEditable = [
            'header', 'text', 'button', 'image', 'video', 'profile',
            'gallery', 'skills', 'experience', 'services', 'pricing', 'spacer',
            'award', 'review', 'contact-form', 'contact-details', 'languages', 'github', 'spotify', 
            'link-block', 'projects', 'profile-photo', 'tools', 'social-media'
          ].includes(componentData.type);
          
          if (!isEditable) return null;
          
          const EditableComponent = Component as React.ComponentType<{
            data: ComponentData;
            isPreviewMode: boolean;
            onUpdate: (data: ComponentData) => void;
          }>;
          
          return (
            <div key={componentData.id} data-editor-component>
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





