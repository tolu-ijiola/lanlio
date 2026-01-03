import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus, X, ExternalLink, Link2 } from "lucide-react";
import { ComponentData } from "@/lib/editor-state";

interface LinkItem {
  title: string;
  url: string;
  description?: string;
}

interface LinkBlockComponentData {
  id: string;
  type: 'link-block';
  links: LinkItem[];
}

interface LinkBlockProps {
  data: LinkBlockComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function LinkBlock({ data, isPreviewMode, onUpdate }: LinkBlockProps) {
  const [newLink, setNewLink] = React.useState<LinkItem>({
    title: '',
    url: '',
    description: '',
  });

  const handleAddLink = () => {
    if (newLink.title.trim() && newLink.url.trim()) {
      onUpdate({
        ...data,
        links: [...data.links, { ...newLink }],
      });
      setNewLink({ title: '', url: '', description: '' });
    }
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = data.links.filter((_, i) => i !== index);
    onUpdate({ ...data, links: newLinks });
  };

  const handleUpdateLink = (index: number, field: keyof LinkItem, value: string) => {
    const newLinks = [...data.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onUpdate({ ...data, links: newLinks });
  };

  if (isPreviewMode) {
    if (data.links.length === 0) return null;
    
    const layout = (data as any).layout || 'grid'; // 'grid' or 'side-by-side'
    
    return (
      <div className={layout === 'side-by-side' ? 'flex flex-wrap gap-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
        {data.links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block p-6 border border-border rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] overflow-hidden"
            style={{
              borderRadius: 'var(--palette-radius, 0.75rem)',
              borderColor: 'rgba(var(--primary-rgb, 0,0,0), 0.1)',
              backgroundColor: 'var(--palette-bg)',
              flex: layout === 'side-by-side' ? '1 1 calc(50% - 0.5rem)' : undefined,
              minWidth: layout === 'side-by-side' ? '200px' : undefined,
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: 'var(--palette-primary)',
                    borderRadius: 'var(--palette-radius, 0.5rem)',
                  }}
                >
                  <Link2 className="size-5 text-white" />
                </div>
                <h3 
                  className="text-lg font-bold group-hover:underline flex-1"
                  style={{ color: 'var(--palette-title)' }}
                >
                  {link.title}
                </h3>
              </div>
              <ExternalLink 
                className="size-5 flex-shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                style={{ color: 'var(--palette-primary)' }}
              />
            </div>
          </a>
        ))}
      </div>
    );
  }

  // Canvas mode - show clean content only
  if (data.links.length === 0) return null;
  
  const layout = (data as any).layout || 'grid';
  const styles = (data as any).styles || {};
  const gap = (data as any).gap || '16px';
  const titleColor = styles.color || 'var(--palette-title)';
  const descriptionColor = styles.descriptionColor || 'var(--palette-description)';
  const backgroundColor = styles.backgroundColor || 'var(--palette-bg)';
  const borderColor = styles.borderColor || 'rgba(var(--primary-rgb, 0,0,0), 0.1)';
  const borderRadius = styles.borderRadius || 'var(--palette-radius, 0.75rem)';
  const borderWidth = styles.borderWidth || '1px';
  const padding = styles.padding || '24px';
  const iconBackgroundColor = styles.iconBackgroundColor || 'var(--palette-primary)';
  const variant = (data as any).variant || 'default';
  
  // Fetch variant - displays link preview
  if (variant === 'fetch') {
    return (
      <div className={layout === 'side-by-side' ? 'flex flex-wrap gap-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
        {data.links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block transition-all duration-300 hover:shadow-lg hover:scale-[1.02] overflow-hidden"
            style={{
              borderRadius: borderRadius,
              borderColor: borderColor,
              borderWidth: borderWidth,
              borderStyle: 'solid',
              backgroundColor: backgroundColor,
              flex: layout === 'side-by-side' ? '1 1 calc(50% - 0.5rem)' : undefined,
              minWidth: layout === 'side-by-side' ? '200px' : undefined,
            }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: iconBackgroundColor,
                      borderRadius: borderRadius,
                    }}
                  >
                    <Link2 className="size-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="text-lg font-bold group-hover:underline truncate"
                      style={{ color: titleColor }}
                    >
                      {link.title}
                    </h3>
                    {link.description && (
                      <p 
                        className="text-sm mt-1 line-clamp-1"
                        style={{ color: descriptionColor }}
                      >
                        {link.description}
                      </p>
                    )}
                    <p 
                      className="text-xs mt-1 truncate opacity-70"
                      style={{ color: descriptionColor }}
                    >
                      {new URL(link.url).hostname}
                    </p>
                  </div>
                </div>
                <ExternalLink 
                  className="size-5 flex-shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  style={{ color: iconBackgroundColor }}
                />
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  }
  
  // Default variant
  return (
    <div className={layout === 'side-by-side' ? 'flex flex-wrap gap-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
      {data.links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] overflow-hidden"
          style={{
            borderRadius: borderRadius,
            borderColor: borderColor,
            borderWidth: borderWidth,
            borderStyle: 'solid',
            backgroundColor: backgroundColor,
            flex: layout === 'side-by-side' ? '1 1 calc(50% - 0.5rem)' : undefined,
            minWidth: layout === 'side-by-side' ? '200px' : undefined,
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: iconBackgroundColor,
                  borderRadius: borderRadius,
                }}
              >
                <Link2 className="size-5 text-white" />
              </div>
              <h3 
                className="text-lg font-bold group-hover:underline flex-1"
                style={{ color: titleColor }}
              >
                {link.title}
              </h3>
            </div>
            <ExternalLink 
              className="size-5 flex-shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              style={{ color: iconBackgroundColor }}
            />
          </div>
        </a>
      ))}
    </div>
  );
}

export default LinkBlock;

