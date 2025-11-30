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

  return (
    <div className="space-y-6">
      {data.links.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.links.map((link, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-3">
                  <Input
                    placeholder="Link Title *"
                    value={link.title}
                    onChange={(e) => handleUpdateLink(index, 'title', e.target.value)}
                    className="h-10"
                  />
                  <Input
                    placeholder="URL *"
                    value={link.url}
                    onChange={(e) => handleUpdateLink(index, 'url', e.target.value)}
                    className="h-10"
                  />
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoveLink(index)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
        <div className="space-y-3">
          <Input
            placeholder="Link Title *"
            value={newLink.title}
            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
            className="h-10"
          />
          <Input
            placeholder="URL *"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            className="h-10"
          />
        </div>
        <Button
          onClick={handleAddLink}
          disabled={!newLink.title.trim() || !newLink.url.trim()}
          className="w-full"
        >
          <Plus className="mr-2" /> Add Link
        </Button>
      </div>
    </div>
  );
}

export default LinkBlock;

