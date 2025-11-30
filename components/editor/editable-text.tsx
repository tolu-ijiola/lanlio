import React from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { TextComponentData, ComponentData } from '@/lib/editor-state';

interface EditableTextProps {
  data: TextComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

const getAlignmentClass = (alignment?: 'left' | 'center' | 'right') => {
  if (alignment === 'left') return 'text-left';
  if (alignment === 'right') return 'text-right';
  return 'text-center';
};

const getAlignmentFlexClass = (alignment?: 'left' | 'center' | 'right') => {
  if (alignment === 'left') return 'justify-start';
  if (alignment === 'right') return 'justify-end';
  return 'justify-center';
};

export function EditableHeader({ data, isPreviewMode, onUpdate }: EditableTextProps) {
  const alignment = (data as any).alignment || 'left';
  const headerLevel = (data as any).headerLevel || 'h2';
  const fontSize = (data as any).fontSize || '2rem';
  const fontWeight = (data as any).fontWeight || '700';
  
  // Get design palette from CSS variables (set by editor)
  const titleColor = typeof window !== 'undefined' 
    ? getComputedStyle(document.documentElement).getPropertyValue('--palette-title').trim() || '#000000'
    : '#000000';
  
  if (isPreviewMode) {
    const Tag = headerLevel as keyof JSX.IntrinsicElements;
    const styles = (data as any).styles || {};
    return (
      <Tag 
        className={`font-bold ${getAlignmentClass(alignment)}`}
        style={{ 
          fontSize: fontSize,
          fontWeight: fontWeight,
          color: styles.color || titleColor,
          lineHeight: data.lineHeight || styles.lineHeight || undefined,
          letterSpacing: data.letterSpacing || styles.letterSpacing || undefined,
          textTransform: styles.textTransform || undefined,
        }}
      >
        {data.content || 'Section Header'}
      </Tag>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 pb-2 border-b">
        <label className="text-sm font-medium">Alignment:</label>
        <select
          value={alignment}
          onChange={(e) => onUpdate({ ...data, alignment: e.target.value as 'left' | 'center' | 'right' } as any)}
          className="px-3 py-2 rounded-md border border-border bg-background text-sm"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <Input
        className="text-3xl font-bold h-14 border-0 focus:ring-0 focus:border-0 w-full focus:outline-none bg-transparent"
        placeholder="Section Header"
        value={data.content}
        onChange={(e) => onUpdate({ ...data, content: e.target.value })}
      />
    </div>
  );
}

export function EditableText({ data, isPreviewMode, onUpdate }: EditableTextProps) {
  const alignment = (data as any).alignment || 'left';
  
  // Get design palette from CSS variables
  const descriptionColor = typeof window !== 'undefined' 
    ? getComputedStyle(document.documentElement).getPropertyValue('--palette-description').trim() || '#4b5563'
    : '#4b5563';
  
  if (isPreviewMode) {
    const styles = (data as any).styles || {};
    return (
      <div className="w-full">
        <p 
          className={`text-sm whitespace-pre-wrap ${getAlignmentClass(alignment)}`}
          style={{
            color: styles.color || descriptionColor,
            fontSize: data.fontSize || styles.fontSize || undefined,
            fontWeight: data.fontWeight || styles.fontWeight || undefined,
            lineHeight: data.lineHeight || styles.lineHeight || undefined,
            letterSpacing: data.letterSpacing || styles.letterSpacing || undefined,
            textTransform: styles.textTransform || undefined,
            maxWidth: styles.maxWidth || undefined,
          }}
        >
          {data.content || ''}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 pb-2 border-b">
        <label className="text-sm font-medium">Alignment:</label>
        <select
          value={alignment}
          onChange={(e) => onUpdate({ ...data, alignment: e.target.value as 'left' | 'center' | 'right' } as any)}
          className="px-3 py-2 rounded-md border border-border bg-background text-sm"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <Textarea
        className="text-base w-full resize-none min-h-[100px] border-0 focus:ring-0 focus:border-0 focus:outline-none bg-transparent"
        placeholder="Enter your text here..."
        value={data.content}
        onChange={(e) => onUpdate({ ...data, content: e.target.value })}
      />
    </div>
  );
}






