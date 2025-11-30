import { FileImage, Upload } from "lucide-react";
import React, { useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ProfileComponentData, ComponentData } from "@/lib/editor-state";

interface ProfileProps {
  data: ProfileComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function Profile({ data, isPreviewMode, onUpdate }: ProfileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({
          ...data,
          avatar: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isPreviewMode) {
    const styles = (data as any).styles || {};
    const spacing = (data as any).spacing || '24px';
    const nameColor = styles.color || 'var(--palette-title)';
    const titleColor = styles.titleColor || 'var(--palette-title)';
    const descriptionColor = styles.descriptionColor || 'var(--palette-description)';
    
    return (
      <div className="space-y-6" style={{ gap: spacing }}>
        <div className="flex items-center gap-4">
          {data.avatar ? (
            <img
              src={data.avatar}
              alt={data.name || 'Profile'}
              className="h-32 min-w-32 rounded-full object-cover shrink-0"
              style={{ borderRadius: '9999px' }}
            />
          ) : (
            <div 
              className="flex items-center gap-2 h-32 min-w-32 justify-center bg-muted rounded-full shrink-0"
              style={{ borderRadius: '9999px' }}
            >
              <FileImage className="size-8 text-muted-foreground" />
            </div>
          )}
          <div className="w-full">
            {data.name && (
              <h1 
                className="text-2xl font-bold"
                style={{ color: nameColor }}
              >
                {data.name}
              </h1>
            )}
            {data.jobTitle && (
              <p 
                className="text-base"
                style={{ color: descriptionColor }}
              >
                {data.jobTitle}
              </p>
            )}
          </div>
        </div>
        {data.title && (
          <h2 
            className="text-3xl font-bold"
            style={{ color: titleColor }}
          >
            {data.title}
          </h2>
        )}
        {data.summary && (
          <p 
            className="text-base whitespace-pre-wrap leading-relaxed"
            style={{ color: descriptionColor }}
          >
            {data.summary}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          {data.avatar ? (
            <div className="relative group shrink-0">
              <img
                src={data.avatar}
                alt={data.name || 'Profile'}
                className="h-32 w-32 rounded-full object-cover"
                style={{ borderRadius: '9999px' }}
              />
              <div 
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity"
                style={{ borderRadius: '9999px' }}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="flex items-center gap-2 h-32 w-32 justify-center bg-muted rounded-full shrink-0"
              style={{ borderRadius: '9999px' }}
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileImage className="size-8" />
              </Button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        <div className="w-full">
          <Input
            className="text-2xl h-12 block font-bold border-0 focus:ring-0 focus:border-0 w-fit focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Your Full name"
            value={data.name || ''}
            onChange={(e) => onUpdate({ ...data, name: e.target.value })}
          />
          <Input
            className="text-base h-10 border-0 focus:ring-0 focus:border-0 w-full focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Your Job title"
            value={data.jobTitle || ''}
            onChange={(e) => onUpdate({ ...data, jobTitle: e.target.value })}
          />
        </div>
      </div>
      <Input
        className="text-3xl h-14 font-bold border-0 focus:ring-0 focus:border-0 w-fit focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Title"
        value={data.title || ''}
        onChange={(e) => onUpdate({ ...data, title: e.target.value })}
      />
      <Textarea
        rows={4}
        className="text-base w-full resize-none min-h-[100px] border-0 focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Professional Summary"
        value={data.summary || ''}
        onChange={(e) => onUpdate({ ...data, summary: e.target.value })}
      />
    </div>
  );
}

export default Profile;
