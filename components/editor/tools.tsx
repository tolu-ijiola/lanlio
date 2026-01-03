import React from 'react'
import { Input } from '../ui/input'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { ToolsComponentData, ComponentData } from '@/lib/editor-state'

interface ToolsProps {
  data: ToolsComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function Tools({ data, isPreviewMode, onUpdate }: ToolsProps) {
  const [newTool, setNewTool] = React.useState('');

  const handleAddTool = () => {
    if (newTool.trim() && !data.tools.includes(newTool.trim())) {
      onUpdate({
        ...data,
        tools: [...data.tools, newTool.trim()],
      });
      setNewTool('');
    }
  };

  const handleRemoveTool = (index: number) => {
    const newTools = data.tools.filter((_, i) => i !== index);
    onUpdate({ ...data, tools: newTools });
  };

  if (isPreviewMode) {
    if (data.tools.length === 0) return null;
    
    const styles = (data as any).styles || {};
    const gap = (data as any).gap || '8px';
    const textColor = styles.color || 'var(--palette-title)';
    const backgroundColor = styles.backgroundColor || '#ffffff';
    const borderColor = styles.borderColor || '#e5e7eb';
    const borderRadius = styles.borderRadius || '24px';
    const borderWidth = styles.borderWidth || '1px';
    const padding = styles.padding || '8px 20px';
    
    return (
      <div className='flex flex-wrap' style={{ gap }}>
        {data.tools.map((tool, index) => (
          <div 
            key={index} 
            className='font-medium transition-all duration-300 hover:scale-105'
            style={{ 
              backgroundColor: backgroundColor,
              color: textColor,
              borderRadius: borderRadius,
              borderColor: borderColor,
              borderWidth: borderWidth,
              borderStyle: 'solid',
              padding: padding,
            }}
          >
            {tool}
          </div>
        ))}
      </div>
    );
  }

  // Canvas mode - show clean content only
  if (data.tools.length === 0) return null;
  
  const styles = (data as any).styles || {};
  const gap = (data as any).gap || '8px';
  const textColor = styles.color || 'var(--palette-title)';
  const backgroundColor = styles.backgroundColor || '#ffffff';
  const borderColor = styles.borderColor || '#e5e7eb';
  const borderRadius = styles.borderRadius || '24px';
  const borderWidth = styles.borderWidth || '1px';
  const padding = styles.padding || '8px 20px';
  const variant = (data as any).variant || 'pill';
  
  // Variant styles
  let variantStyles: any = {};
  if (variant === 'badge') {
    variantStyles = { borderRadius: '8px', padding: '6px 12px' };
  } else if (variant === 'minimal') {
    variantStyles = { backgroundColor: 'transparent', borderWidth: '0px' };
  } else if (variant === 'outlined') {
    variantStyles = { backgroundColor: 'transparent', borderWidth: '2px' };
  }
  
  return (
    <div className='flex flex-wrap' style={{ gap }}>
      {data.tools.map((tool, index) => (
        <div 
          key={index} 
          className='font-medium transition-all duration-300 hover:scale-105'
          style={{ 
            backgroundColor: variantStyles.backgroundColor || backgroundColor,
            color: textColor,
            borderRadius: variantStyles.borderRadius || borderRadius,
            borderColor: borderColor,
            borderWidth: variantStyles.borderWidth || borderWidth,
            borderStyle: 'solid',
            padding: variantStyles.padding || padding,
          }}
        >
          {tool}
        </div>
      ))}
    </div>
  );
}

export default Tools
