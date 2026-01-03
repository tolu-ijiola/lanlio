"use client";

import { FileImage, Upload, User } from "lucide-react";
import React, { useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
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
    // Always use flex side-by-side layout
    const imageSize = data.avatarSize || '128px';
    const avatarBorderRadius = data.avatarBorderRadius || '50%'; // Full circle by default
    
    // Get text sizes and colors
    const nameSize = data.nameSize || 'h1';
    const nameColor = data.nameColor || 'var(--palette-title, #000000)';
    const jobTitleSize = data.jobTitleSize || 'p';
    const jobTitleColor = data.jobTitleColor || 'var(--palette-description, #666666)';
    const titleSize = data.titleSize || 'h2';
    const titleColor = data.titleColor || 'var(--palette-title, #000000)';
    const summarySize = data.summarySize || 'p';
    const summaryColor = data.summaryColor || 'var(--palette-description, #666666)';
    
    // Helper to get font size from heading size
    const getFontSize = (size: string) => {
      const sizeMap: Record<string, string> = {
        'h1': '2.25rem',  // text-4xl equivalent
        'h2': '1.875rem', // text-3xl equivalent
        'h3': '1.5rem',   // text-2xl equivalent
        'h4': '1.25rem',  // text-xl equivalent
        'h5': '1.125rem', // text-lg equivalent
        'h6': '1rem',     // text-base equivalent
        'p': '1rem'       // text-base equivalent
      };
      return sizeMap[size] || '1rem';
    };
    
    // Parse image size to number for calculations
    const parseImageSize = (size: string) => {
      const match = size.match(/(\d+)/);
      return match ? parseInt(match[1]) : 128;
    };
    const imageSizeNum = parseImageSize(imageSize);
    const imageSizePx = `${imageSizeNum}px`;

    // Side by side layout - flex
    return (
      <div className="space-y-6" data-profile-id={data.id} data-editor-component>
        <div className="flex items-center gap-4">
          {data.avatar ? (
            <img
              src={data.avatar}
              alt={data.name || 'Profile'}
              className="shrink-0 object-cover overflow-hidden"
              style={{ 
                width: imageSizePx,
                height: imageSizePx,
                borderRadius: avatarBorderRadius,
                objectFit: 'cover'
              }}
            />
          ) : (
            <div 
              className="flex flex-col items-center justify-center bg-muted/40 border-2 border-dashed border-border shrink-0 overflow-hidden"
              style={{ 
                width: imageSizePx,
                height: imageSizePx,
                borderRadius: avatarBorderRadius,
                minWidth: imageSizePx,
                minHeight: imageSizePx,
                backgroundColor: 'rgba(0, 0, 0, 0.05)'
              }}
            >
              <User className="text-muted-foreground" style={{ width: `${Math.min(imageSizeNum * 0.3, 48)}px`, height: `${Math.min(imageSizeNum * 0.3, 48)}px` }} />
            </div>
          )}
          <div className="w-full">
            {data.name && (
              <h1 
                className="font-bold"
                style={{ fontSize: getFontSize(nameSize), color: nameColor }}
              >
                {data.name}
              </h1>
            )}
            {data.jobTitle && (
              <p 
                className="mt-1"
                style={{ fontSize: getFontSize(jobTitleSize), color: jobTitleColor }}
              >
                {data.jobTitle}
              </p>
            )}
          </div>
        </div>
        {data.title && (
          <h2 
            className="font-bold"
            style={{ fontSize: getFontSize(titleSize), color: titleColor }}
          >
            {data.title}
          </h2>
        )}
        {data.summary && (
          <p 
            className="whitespace-pre-wrap leading-relaxed"
            style={{ fontSize: getFontSize(summarySize), color: summaryColor }}
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
                className="object-cover"
                style={{ 
                  width: data.avatarSize || '128px',
                  height: data.avatarSize || '128px',
                  borderRadius: data.avatarBorderRadius || '50%'
                }}
              />
              <div 
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                style={{ borderRadius: data.avatarBorderRadius || '50%' }}
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
              className="flex items-center gap-2 justify-center bg-muted shrink-0"
              style={{ 
                width: data.avatarSize || '128px',
                height: data.avatarSize || '128px',
                borderRadius: data.avatarBorderRadius || '50%'
              }}
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

      {/* Styling Controls */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-sm font-semibold">Styling</h3>

        {/* Avatar Styling */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Avatar Size</Label>
            <div className="flex gap-1">
              <Input
                type="number"
                placeholder="128"
                value={parseInt(data.avatarSize?.replace('px', '') || '128')}
                min={64}
                max={256}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    onUpdate({ ...data, avatarSize: '128px' });
                  } else {
                    const num = Math.min(Math.max(64, parseFloat(val) || 128), 256);
                    onUpdate({ ...data, avatarSize: `${num}px` });
                  }
                }}
                className="h-9 text-xs flex-1"
              />
              <select
                disabled
                className="h-9 px-2 text-xs border border-border rounded-md bg-muted/50 text-muted-foreground min-w-[50px] cursor-not-allowed"
              >
                <option value="px">px</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Avatar Border Radius</Label>
            <div className="flex gap-1">
              <Input
                type="number"
                placeholder="50"
                value={parseInt(data.avatarBorderRadius?.replace('%', '').replace('px', '') || '50')}
                min={0}
                max={50}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    onUpdate({ ...data, avatarBorderRadius: '50%' });
                  } else {
                    const num = Math.min(Math.max(0, parseFloat(val) || 50), 50);
                    onUpdate({ ...data, avatarBorderRadius: `${num}%` });
                  }
                }}
                className="h-9 text-xs flex-1"
              />
              <select
                disabled
                className="h-9 px-2 text-xs border border-border rounded-md bg-muted/50 text-muted-foreground min-w-[50px] cursor-not-allowed"
              >
                <option value="%">%</option>
              </select>
            </div>
          </div>
        </div>

        {/* Text Sizes */}
        <div className="space-y-3 pt-2 border-t border-border/50">
          <Label className="text-xs font-medium">Text Sizes</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Name</Label>
              <Select
                value={data.nameSize || 'h1'}
                onValueChange={(value) => onUpdate({ ...data, nameSize: value })}
              >
                <SelectTrigger className="h-9 w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1 (Large)</SelectItem>
                  <SelectItem value="h2">H2</SelectItem>
                  <SelectItem value="h3">H3</SelectItem>
                  <SelectItem value="h4">H4</SelectItem>
                  <SelectItem value="h5">H5</SelectItem>
                  <SelectItem value="h6">H6</SelectItem>
                  <SelectItem value="p">Paragraph</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Job Title</Label>
              <Select
                value={data.jobTitleSize || 'p'}
                onValueChange={(value) => onUpdate({ ...data, jobTitleSize: value })}
              >
                <SelectTrigger className="h-9 w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1</SelectItem>
                  <SelectItem value="h2">H2</SelectItem>
                  <SelectItem value="h3">H3</SelectItem>
                  <SelectItem value="h4">H4</SelectItem>
                  <SelectItem value="h5">H5</SelectItem>
                  <SelectItem value="h6">H6</SelectItem>
                  <SelectItem value="p">Paragraph</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Title</Label>
              <Select
                value={data.titleSize || 'h2'}
                onValueChange={(value) => onUpdate({ ...data, titleSize: value })}
              >
                <SelectTrigger className="h-9 w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1</SelectItem>
                  <SelectItem value="h2">H2</SelectItem>
                  <SelectItem value="h3">H3</SelectItem>
                  <SelectItem value="h4">H4</SelectItem>
                  <SelectItem value="h5">H5</SelectItem>
                  <SelectItem value="h6">H6</SelectItem>
                  <SelectItem value="p">Paragraph</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Summary</Label>
              <Select
                value={data.summarySize || 'p'}
                onValueChange={(value) => onUpdate({ ...data, summarySize: value })}
              >
                <SelectTrigger className="h-9 w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1</SelectItem>
                  <SelectItem value="h2">H2</SelectItem>
                  <SelectItem value="h3">H3</SelectItem>
                  <SelectItem value="h4">H4</SelectItem>
                  <SelectItem value="h5">H5</SelectItem>
                  <SelectItem value="h6">H6</SelectItem>
                  <SelectItem value="p">Paragraph</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Text Colors */}
        <div className="space-y-3 pt-2 border-t border-border/50">
          <Label className="text-xs font-medium">Text Colors</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Name Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={data.nameColor?.replace('var(--palette-title, #000000)', '#000000') || '#000000'}
                  onChange={(e) => onUpdate({ ...data, nameColor: e.target.value })}
                  className="h-9 w-16 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  placeholder="#000000"
                  value={data.nameColor || ''}
                  onChange={(e) => onUpdate({ ...data, nameColor: e.target.value })}
                  className="h-9 flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Job Title Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={data.jobTitleColor?.replace('var(--palette-description, #666666)', '#666666') || '#666666'}
                  onChange={(e) => onUpdate({ ...data, jobTitleColor: e.target.value })}
                  className="h-9 w-16 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  placeholder="#666666"
                  value={data.jobTitleColor || ''}
                  onChange={(e) => onUpdate({ ...data, jobTitleColor: e.target.value })}
                  className="h-9 flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Title Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={data.titleColor?.replace('var(--palette-title, #000000)', '#000000') || '#000000'}
                  onChange={(e) => onUpdate({ ...data, titleColor: e.target.value })}
                  className="h-9 w-16 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  placeholder="#000000"
                  value={data.titleColor || ''}
                  onChange={(e) => onUpdate({ ...data, titleColor: e.target.value })}
                  className="h-9 flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Summary Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={data.summaryColor?.replace('var(--palette-description, #666666)', '#666666') || '#666666'}
                  onChange={(e) => onUpdate({ ...data, summaryColor: e.target.value })}
                  className="h-9 w-16 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  placeholder="#666666"
                  value={data.summaryColor || ''}
                  onChange={(e) => onUpdate({ ...data, summaryColor: e.target.value })}
                  className="h-9 flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
