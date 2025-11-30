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

  return (
    <div className='space-y-4'>
      <div className="flex gap-2">
        <Input
          className="h-12 block border-0 focus:ring-0 focus:border-0 w-full focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Add your tools"
          value={newTool}
          onChange={(e) => setNewTool(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTool();
            }
          }}
        />
        <Button onClick={handleAddTool} disabled={!newTool.trim()}>
          Add
        </Button>
      </div>
      
      {data.tools.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {data.tools.map((tool, index) => (
            <div 
              key={index} 
              className='rounded-full px-4 py-2 flex items-center gap-2 group font-medium border bg-muted'
            >
              <p>{tool}</p>
              <Button
                size="icon"
                variant="ghost"
                className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveTool(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Tools
