import { FileImage, Upload, X } from 'lucide-react'
import Image from 'next/image'
import React, { useRef } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
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

  if (isPreviewMode) {
    if (!data.src) {
      return null;
    }
    
    const alignment = (data as any).alignment || 'left';
    const fitMode = (data as any).fitMode || 'contain';
    const styles = (data as any).styles || {};
    const width = styles.width || 'auto';
    const height = styles.height || 'auto';
    
    const alignmentClass = 
      alignment === 'left' ? 'justify-start' :
      alignment === 'right' ? 'justify-end' :
      'justify-center';
    
    return (
      <div className={`flex ${alignmentClass}`}>
        <div 
          className='overflow-hidden' 
          style={{ 
            borderRadius: styles.borderRadius || 'var(--palette-radius, 0.5rem)',
            width: width === 'auto' ? '100%' : width,
            maxWidth: width === 'auto' ? '100%' : width,
          }}
        >
          <img
            src={data.src}
            alt={data.alt || 'Image'}
            style={{ 
              width: width === 'auto' ? '100%' : width,
              height: height === 'auto' ? 'auto' : height,
              objectFit: fitMode,
              borderRadius: styles.borderRadius || 'var(--palette-radius, 0.5rem)',
              display: 'block',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className='border border-border overflow-hidden' style={{ borderRadius: 'var(--palette-radius, 0.5rem)' }}>
      {data.src ? (
        <div className='relative group'>
          <img
            src={data.src}
            alt={data.alt || 'Image'}
            className='w-full h-auto object-cover max-h-[500px]'
            style={{ borderRadius: 'var(--palette-radius, 0.5rem)' }}
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
      
      <div className='p-4 space-y-2 border-t border-border bg-muted/50'>
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