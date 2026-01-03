import { FileImage, Upload, X } from 'lucide-react'
import Image from 'next/image'
import React, { useRef } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Slider } from '../ui/slider'
import { ImageComponentData, ComponentData } from '@/lib/editor-state'

interface EditorImageProps {
  data: ImageComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function EditorImage({ data, isPreviewMode, onUpdate }: EditorImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({
          ...data,
          src: reader.result as string,
          alt: data.alt || file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    onUpdate({ ...data, src: url });
  };

  const handleRemoveImage = () => {
    onUpdate({ ...data, src: '', alt: '' });
  };

  // Get styles from data
  const componentStyles = ((data as any).styles || {}) as React.CSSProperties;
  const imageWidth = componentStyles.width || '100%';
  const imageHeight = componentStyles.height || undefined;
  
  // Image styling properties
  const objectFit = data.objectFit || 'cover';
  const objectPosition = data.objectPosition || 'center';
  const borderWidth = data.borderWidth || '0px';
  const borderStyle = data.borderStyle || 'solid';
  const borderColor = data.borderColor || '#000000';
  
  // Handle border radius - support both old single value and new individual corners
  const borderRadiusTopLeft = data.borderRadiusTopLeft;
  const borderRadiusTopRight = data.borderRadiusTopRight;
  const borderRadiusBottomRight = data.borderRadiusBottomRight;
  const borderRadiusBottomLeft = data.borderRadiusBottomLeft;
  
  // If individual corners are set (even if some are empty), use them; otherwise fall back to single value or default
  let borderRadius: string;
  const hasIndividualCorners = borderRadiusTopLeft !== undefined || 
                                borderRadiusTopRight !== undefined || 
                                borderRadiusBottomRight !== undefined || 
                                borderRadiusBottomLeft !== undefined;
  
  if (hasIndividualCorners) {
    // Use individual corners, defaulting to '0px' if not set
    borderRadius = `${borderRadiusTopLeft || '0px'} ${borderRadiusTopRight || '0px'} ${borderRadiusBottomRight || '0px'} ${borderRadiusBottomLeft || '0px'}`;
  } else {
    // Fall back to single borderRadius value or default
    borderRadius = data.borderRadius || componentStyles.borderRadius || 'var(--palette-radius, 0.5rem)';
  }
  
  const opacity = data.opacity !== undefined ? data.opacity : 1;
  const backgroundColor = data.backgroundColor || 'transparent';
  const anchorName = data.anchorName || '';
  
  // Parse border width to get numeric value for max validation
  const borderWidthValue = parseFloat(borderWidth.replace(/px|rem|em|%/, '')) || 0;
  
  const imageStyle: React.CSSProperties = {
    borderRadius: borderRadius,
    width: imageWidth,
    height: imageHeight,
    objectFit: objectFit,
    objectPosition: objectPosition,
    display: 'block',
    borderWidth: borderWidth,
    borderStyle: borderStyle,
    borderColor: borderColor,
    opacity: opacity,
  };

  // Container should be full width when image is 100%, otherwise wrap
  const isFullWidth = imageWidth === '100%' || !imageWidth || imageWidth === '';
  const containerStyle: React.CSSProperties = {
    borderRadius: borderRadius,
    display: isFullWidth ? 'block' : 'inline-block',
    width: isFullWidth ? '100%' : 'auto',
    maxWidth: '100%',
    backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : undefined,
    padding: backgroundColor !== 'transparent' && backgroundColor ? '8px' : undefined,
  };

  if (isPreviewMode) {
    if (!data.src) {
      // Show placeholder image when no image is set
      return (
        <div 
          id={anchorName || undefined}
          className='border-2 border-dashed border-border bg-muted/30 overflow-hidden flex items-center justify-center min-h-[200px]'
          style={{ borderRadius: borderRadius }}
        >
          <div className='flex flex-col items-center justify-center gap-3 text-muted-foreground'>
            <FileImage className="size-12 opacity-50" />
            <p className='text-sm font-medium'>Image Placeholder</p>
            <p className='text-xs opacity-70'>Add an image to replace this placeholder</p>
          </div>
        </div>
      );
    }

    return (
      <div 
        id={anchorName || undefined}
        className='overflow-hidden' 
        style={containerStyle}
      >
        <img
          src={data.src}
          alt={data.alt || 'Image'}
          style={imageStyle}
        />
      </div>
    );
  }

  // Editor container style - use same logic as preview
  const editorContainerStyle: React.CSSProperties = {
    borderRadius: borderRadius,
    ...containerStyle,
  };

  return (
    <div className='border border-border overflow-hidden' style={editorContainerStyle}>
      {data.src ? (
        <div className='relative group'>
          <img
            src={data.src}
            alt={data.alt || 'Image'}
            style={{
              ...imageStyle,
              maxHeight: '500px',
            }}
          />
          <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Change Image
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center min-h-[200px] py-12 space-y-4'>
          <FileImage className="size-10 text-muted-foreground" />
          <p className='text-sm text-muted-foreground'>Add Image</p>
          <div className='flex gap-2'>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </div>
        </div>
      )}
      
      <div className='p-4 space-y-4 border-t border-border bg-muted/50'>
        {/* Basic Image Settings */}
        <div className='space-y-2'>
          <Input
            placeholder="Or paste image URL"
            value={data.src}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="h-9"
          />
          <Input
            placeholder="Alt text (optional)"
            value={data.alt || ''}
            onChange={(e) => onUpdate({ ...data, alt: e.target.value })}
            className="h-9"
          />
        </div>

        {/* Image Styling Controls */}
        <div className='space-y-4 pt-2 border-t border-border/50'>
          <div className='space-y-3'>
            <Label className="text-xs font-medium">Image Fit</Label>
            <Select
              value={objectFit}
              onValueChange={(value: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down') => {
                onUpdate({ ...data, objectFit: value });
              }}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cover">Cover</SelectItem>
                <SelectItem value="contain">Contain</SelectItem>
                <SelectItem value="fill">Fill</SelectItem>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="scale-down">Scale Down</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-3'>
            <Label className="text-xs font-medium">Image Position</Label>
            <Select
              value={objectPosition}
              onValueChange={(value: string) => {
                onUpdate({ ...data, objectPosition: value });
              }}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="top left">Top Left</SelectItem>
                <SelectItem value="top right">Top Right</SelectItem>
                <SelectItem value="bottom left">Bottom Left</SelectItem>
                <SelectItem value="bottom right">Bottom Right</SelectItem>
                <SelectItem value="center left">Center Left</SelectItem>
                <SelectItem value="center right">Center Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-3'>
            <Label className="text-xs font-medium">Border Width</Label>
            <div className="flex gap-1">
              <Input
                type="number"
                placeholder="0"
                value={borderWidthValue}
                min={0}
                max={8}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    onUpdate({ ...data, borderWidth: '0px' });
                  } else {
                    const num = Math.min(Math.max(0, parseFloat(val) || 0), 8);
                    onUpdate({ ...data, borderWidth: `${num}px` });
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

          <div className='space-y-3'>
            <Label className="text-xs font-medium">Border Style</Label>
            <Select
              value={borderStyle}
              onValueChange={(value: 'solid' | 'dashed' | 'dotted' | 'double' | 'none') => {
                onUpdate({ ...data, borderStyle: value });
              }}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
                <SelectItem value="double">Double</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-3'>
            <Label className="text-xs font-medium">Border Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={borderColor}
                onChange={(e) => onUpdate({ ...data, borderColor: e.target.value })}
                className="h-9 w-16 p-1 cursor-pointer"
              />
              <Input
                type="text"
                placeholder="#000000"
                value={borderColor}
                onChange={(e) => onUpdate({ ...data, borderColor: e.target.value })}
                className="h-9 flex-1"
              />
            </div>
          </div>

          <div className='space-y-3'>
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Border Radius</Label>
              <Select
                value=""
                onValueChange={(value: string) => {
                  const presetValues: Record<string, { topLeft: string; topRight: string; bottomRight: string; bottomLeft: string }> = {
                    'none': { topLeft: '0px', topRight: '0px', bottomRight: '0px', bottomLeft: '0px' },
                    'small': { topLeft: '4px', topRight: '4px', bottomRight: '4px', bottomLeft: '4px' },
                    'medium': { topLeft: '8px', topRight: '8px', bottomRight: '8px', bottomLeft: '8px' },
                    'large': { topLeft: '12px', topRight: '12px', bottomRight: '12px', bottomLeft: '12px' },
                    'xl': { topLeft: '16px', topRight: '16px', bottomRight: '16px', bottomLeft: '16px' },
                    'full': { topLeft: '9999px', topRight: '9999px', bottomRight: '9999px', bottomLeft: '9999px' },
                  };
                  if (presetValues[value]) {
                    const preset = presetValues[value];
                    onUpdate({
                      ...data,
                      borderRadiusTopLeft: preset.topLeft,
                      borderRadiusTopRight: preset.topRight,
                      borderRadiusBottomRight: preset.bottomRight,
                      borderRadiusBottomLeft: preset.bottomLeft,
                      borderRadius: undefined, // Clear single value when using individual corners
                    });
                  }
                }}
              >
                <SelectTrigger className="h-7 w-[100px] text-xs">
                  <SelectValue placeholder="Presets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="small">Small (4px)</SelectItem>
                  <SelectItem value="medium">Medium (8px)</SelectItem>
                  <SelectItem value="large">Large (12px)</SelectItem>
                  <SelectItem value="xl">XL (16px)</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Top Left</Label>
                <div className="flex gap-1">
                  <Input
                    type="number"
                    placeholder="0"
                    value={borderRadiusTopLeft ? parseFloat(borderRadiusTopLeft.replace(/px|rem|em|%/, '')) || '' : ''}
                    min={0}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        onUpdate({ ...data, borderRadiusTopLeft: '0px', borderRadius: undefined });
                      } else {
                        const num = Math.max(0, parseFloat(val) || 0);
                        onUpdate({ ...data, borderRadiusTopLeft: `${num}px`, borderRadius: undefined });
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
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Top Right</Label>
                <div className="flex gap-1">
                  <Input
                    type="number"
                    placeholder="0"
                    value={borderRadiusTopRight ? parseFloat(borderRadiusTopRight.replace(/px|rem|em|%/, '')) || '' : ''}
                    min={0}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        onUpdate({ ...data, borderRadiusTopRight: '0px', borderRadius: undefined });
                      } else {
                        const num = Math.max(0, parseFloat(val) || 0);
                        onUpdate({ ...data, borderRadiusTopRight: `${num}px`, borderRadius: undefined });
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
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Bottom Right</Label>
                <div className="flex gap-1">
                  <Input
                    type="number"
                    placeholder="0"
                    value={borderRadiusBottomRight ? parseFloat(borderRadiusBottomRight.replace(/px|rem|em|%/, '')) || '' : ''}
                    min={0}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        onUpdate({ ...data, borderRadiusBottomRight: '0px', borderRadius: undefined });
                      } else {
                        const num = Math.max(0, parseFloat(val) || 0);
                        onUpdate({ ...data, borderRadiusBottomRight: `${num}px`, borderRadius: undefined });
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
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Bottom Left</Label>
                <div className="flex gap-1">
                  <Input
                    type="number"
                    placeholder="0"
                    value={borderRadiusBottomLeft ? parseFloat(borderRadiusBottomLeft.replace(/px|rem|em|%/, '')) || '' : ''}
                    min={0}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        onUpdate({ ...data, borderRadiusBottomLeft: '0px', borderRadius: undefined });
                      } else {
                        const num = Math.max(0, parseFloat(val) || 0);
                        onUpdate({ ...data, borderRadiusBottomLeft: `${num}px`, borderRadius: undefined });
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
            </div>
          </div>

          <div className='space-y-3'>
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Opacity</Label>
              <span className="text-xs text-muted-foreground">{Math.round(opacity * 100)}%</span>
            </div>
            <Slider
              value={[opacity * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={(values) => {
                onUpdate({ ...data, opacity: values[0] / 100 });
              }}
              className="w-full"
            />
          </div>

          <div className='space-y-3'>
            <Label className="text-xs font-medium">Background Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                onChange={(e) => onUpdate({ ...data, backgroundColor: e.target.value })}
                className="h-9 w-16 p-1 cursor-pointer"
              />
              <Input
                type="text"
                placeholder="transparent or #ffffff"
                value={backgroundColor}
                onChange={(e) => onUpdate({ ...data, backgroundColor: e.target.value || 'transparent' })}
                className="h-9 flex-1"
              />
            </div>
          </div>

          <div className='space-y-3'>
            <Label className="text-xs font-medium">Anchor Name (for navigation)</Label>
            <Input
              type="text"
              placeholder="e.g., section-1"
              value={anchorName}
              onChange={(e) => onUpdate({ ...data, anchorName: e.target.value })}
              className="h-9"
            />
            <p className="text-xs text-muted-foreground">
              Use this to link to this section from navigation. Leave empty to disable.
            </p>
          </div>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}

export default EditorImage
