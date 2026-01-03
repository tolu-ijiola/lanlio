"use client";

import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface AlignmentControlProps {
  value: 'left' | 'center' | 'right' | 'justify';
  onChange: (value: 'left' | 'center' | 'right' | 'justify') => void;
  label?: string;
  className?: string;
  variant?: 'horizontal' | 'vertical';
}

export function AlignmentControl({ 
  value, 
  onChange, 
  label,
  className,
  variant = 'horizontal'
}: AlignmentControlProps) {
  if (variant === 'vertical') {
    return (
      <div className={cn("space-y-1.5", className)}>
        {label && (
          <label className="block text-xs text-muted-foreground">{label}</label>
        )}
        <div className="flex flex-col gap-1.5">
          <Button
            type="button"
            variant={(value as any) === 'top' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange('top' as any)}
            className="w-full justify-start"
          >
            <AlignLeft className="h-4 w-4 mr-2 rotate-90" />
            Top
          </Button>
          <Button
            type="button"
            variant={(value as any) === 'middle' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange('middle' as any)}
            className="w-full justify-start"
          >
            <AlignCenter className="h-4 w-4 mr-2 rotate-90" />
            Middle
          </Button>
          <Button
            type="button"
            variant={(value as any) === 'bottom' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange('bottom' as any)}
            className="w-full justify-start"
          >
            <AlignRight className="h-4 w-4 mr-2 rotate-90" />
            Bottom
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="block text-xs text-muted-foreground">{label}</label>
      )}
      <div className="flex gap-1.5">
        <Button
          type="button"
          variant={value === 'left' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange('left')}
          className="flex-1"
          title="Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={value === 'center' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange('center')}
          className="flex-1"
          title="Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={value === 'right' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange('right')}
          className="flex-1"
          title="Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={value === 'justify' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange('justify')}
          className="flex-1"
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

