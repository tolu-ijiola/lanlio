"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Bold, Italic, Underline } from 'lucide-react';
import { AlignmentControl } from '../ui/alignment-control';
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

export function EditableHeader({ data, isPreviewMode, onUpdate }: EditableTextProps) {
  const alignment = data.alignment || 'left';
  const fontSize = data.fontSize || '1.875rem'; // text-3xl default
  const fontColor = data.fontColor || '#374151'; // text-gray-700
  const fontWeight = data.fontWeight || 'bold';
  const fontStyle = data.fontStyle || 'normal';
  const textDecoration = data.textDecoration || 'none';
  
  const contentEditableRef = useRef<HTMLHeadingElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const isUserTypingRef = useRef(false);

  useEffect(() => {
    // Only update textContent if:
    // 1. Not in preview mode
    // 2. Element exists
    // 3. User is not currently typing (element doesn't have focus)
    // 4. Content actually changed
    if (contentEditableRef.current && !isPreviewMode && !isUserTypingRef.current) {
      const currentContent = contentEditableRef.current.textContent || '';
      const newContent = data.content || 'Section Header';
      
      // Only update if content is different (prevents infinite loop)
      if (currentContent !== newContent) {
        contentEditableRef.current.textContent = newContent;
      }
    }
  }, [data.content, isPreviewMode]);

  const handleContentChange = () => {
    if (contentEditableRef.current) {
      const newContent = contentEditableRef.current.textContent || '';
      onUpdate({ ...data, content: newContent });
    }
  };

  if (isPreviewMode) {
    return (
      <h2 
        className={`max-w-4xl mx-auto ${getAlignmentClass(alignment)}`}
        style={{
          fontSize: fontSize,
          color: fontColor,
          fontWeight: fontWeight,
          fontStyle: fontStyle,
          textDecoration: textDecoration,
        }}
      >
        {data.content || 'Section Header'}
      </h2>
    );
  }

  return (
    <div className="space-y-4">
      {/* Formatting Controls - Vertical List Style */}
      <div className="space-y-4 pt-4 border-t border-border">
        {/* Text Formatting */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Text Formatting</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={fontWeight === 'bold' ? 'default' : 'outline'}
              onClick={() => {
                const newWeight = fontWeight === 'bold' ? 'normal' : 'bold';
                onUpdate({ ...data, fontWeight: newWeight });
              }}
              className="h-9 w-9 p-0"
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={fontStyle === 'italic' ? 'default' : 'outline'}
              onClick={() => {
                const newStyle = fontStyle === 'italic' ? 'normal' : 'italic';
                onUpdate({ ...data, fontStyle: newStyle });
              }}
              className="h-9 w-9 p-0"
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={textDecoration === 'underline' ? 'default' : 'outline'}
              onClick={() => {
                const newDecoration = textDecoration === 'underline' ? 'none' : 'underline';
                onUpdate({ ...data, textDecoration: newDecoration });
              }}
              className="h-9 w-9 p-0"
              title="Underline"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Font Size</Label>
          <Select
            value={fontSize}
            onValueChange={(value) => onUpdate({ ...data, fontSize: value })}
          >
            <SelectTrigger className="h-9 w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.75rem">Small (12px)</SelectItem>
              <SelectItem value="0.875rem">Base (14px)</SelectItem>
              <SelectItem value="1rem">Large (16px)</SelectItem>
              <SelectItem value="1.125rem">XL (18px)</SelectItem>
              <SelectItem value="1.25rem">2XL (20px)</SelectItem>
              <SelectItem value="1.5rem">3XL (24px)</SelectItem>
              <SelectItem value="1.875rem">4XL (30px)</SelectItem>
              <SelectItem value="2.25rem">5XL (36px)</SelectItem>
              <SelectItem value="3rem">6XL (48px)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Alignment */}
        <div className="space-y-2">
          <AlignmentControl
            value={alignment}
            onChange={(value) => onUpdate({ ...data, alignment: value as 'left' | 'center' | 'right' })}
            label="Alignment"
          />
        </div>
      </div>

      {/* Editable Content */}
      <h2
        ref={contentEditableRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleContentChange}
        onBlur={handleContentChange}
        className={`outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 min-h-[3rem] ${getAlignmentClass(alignment)}`}
        style={{
          fontSize: fontSize,
          color: fontColor,
          fontWeight: fontWeight,
          fontStyle: fontStyle,
          textDecoration: textDecoration,
        }}
        onFocus={() => {
          setIsEditing(true);
          isUserTypingRef.current = true;
        }}
        onBlur={() => {
          setIsEditing(false);
          // Small delay to ensure blur event completes
          setTimeout(() => {
            isUserTypingRef.current = false;
          }, 100);
        }}
      />
    </div>
  );
}

export function EditableText({ data, isPreviewMode, onUpdate }: EditableTextProps) {
  const alignment = data.alignment || 'left';
  const fontSize = data.fontSize || '0.875rem'; // text-sm default
  const fontColor = data.fontColor || '#374151'; // text-gray-700
  const fontWeight = data.fontWeight || 'normal';
  const fontStyle = data.fontStyle || 'normal';
  const textDecoration = data.textDecoration || 'none';
  
  const contentEditableRef = useRef<HTMLParagraphElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const isUserTypingRef = useRef(false);

  useEffect(() => {
    // Only update textContent if:
    // 1. Not in preview mode
    // 2. Element exists
    // 3. User is not currently typing (element doesn't have focus)
    // 4. Content actually changed
    if (contentEditableRef.current && !isPreviewMode && !isUserTypingRef.current) {
      const currentContent = contentEditableRef.current.textContent || '';
      const newContent = data.content || '';
      
      // Only update if content is different (prevents infinite loop)
      if (currentContent !== newContent) {
        contentEditableRef.current.textContent = newContent;
      }
    }
  }, [data.content, isPreviewMode]);

  const handleContentChange = () => {
    if (contentEditableRef.current) {
      const newContent = contentEditableRef.current.textContent || '';
      onUpdate({ ...data, content: newContent });
    }
  };

  if (isPreviewMode) {
    return (
      <div className="max-w-4xl mx-auto">
        <p 
          className={`whitespace-pre-wrap leading-relaxed ${getAlignmentClass(alignment)}`}
          style={{
            fontSize: fontSize,
            color: fontColor,
            fontWeight: fontWeight,
            fontStyle: fontStyle,
            textDecoration: textDecoration,
          }}
        >
          {data.content || ''}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Formatting Controls - Vertical List Style */}
      <div className="space-y-4 pt-4 border-t border-border">
        {/* Text Formatting */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Text Formatting</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={fontWeight === 'bold' ? 'default' : 'outline'}
              onClick={() => {
                const newWeight = fontWeight === 'bold' ? 'normal' : 'bold';
                onUpdate({ ...data, fontWeight: newWeight });
              }}
              className="h-9 w-9 p-0"
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={fontStyle === 'italic' ? 'default' : 'outline'}
              onClick={() => {
                const newStyle = fontStyle === 'italic' ? 'normal' : 'italic';
                onUpdate({ ...data, fontStyle: newStyle });
              }}
              className="h-9 w-9 p-0"
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={textDecoration === 'underline' ? 'default' : 'outline'}
              onClick={() => {
                const newDecoration = textDecoration === 'underline' ? 'none' : 'underline';
                onUpdate({ ...data, textDecoration: newDecoration });
              }}
              className="h-9 w-9 p-0"
              title="Underline"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Font Size</Label>
          <Select
            value={fontSize}
            onValueChange={(value) => onUpdate({ ...data, fontSize: value })}
          >
            <SelectTrigger className="h-9 w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.75rem">Small (12px)</SelectItem>
              <SelectItem value="0.875rem">Base (14px)</SelectItem>
              <SelectItem value="1rem">Large (16px)</SelectItem>
              <SelectItem value="1.125rem">XL (18px)</SelectItem>
              <SelectItem value="1.25rem">2XL (20px)</SelectItem>
              <SelectItem value="1.5rem">3XL (24px)</SelectItem>
              <SelectItem value="1.875rem">4XL (30px)</SelectItem>
              <SelectItem value="2.25rem">5XL (36px)</SelectItem>
              <SelectItem value="3rem">6XL (48px)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Alignment */}
        <div className="space-y-2">
          <AlignmentControl
            value={alignment}
            onChange={(value) => onUpdate({ ...data, alignment: value as 'left' | 'center' | 'right' })}
            label="Alignment"
          />
        </div>
      </div>

      {/* Editable Content */}
      <p
        ref={contentEditableRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleContentChange}
        onBlur={handleContentChange}
        className={`outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 min-h-[100px] whitespace-pre-wrap leading-relaxed ${getAlignmentClass(alignment)}`}
        style={{
          fontSize: fontSize,
          color: fontColor,
          fontWeight: fontWeight,
          fontStyle: fontStyle,
          textDecoration: textDecoration,
        }}
        onFocus={() => {
          setIsEditing(true);
          isUserTypingRef.current = true;
        }}
        onBlur={() => {
          setIsEditing(false);
          // Small delay to ensure blur event completes
          setTimeout(() => {
            isUserTypingRef.current = false;
          }, 100);
        }}
      />
    </div>
  );
}
