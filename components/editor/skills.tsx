import React from 'react'
import { Input } from '../ui/input'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { SkillsComponentData, ComponentData } from '@/lib/editor-state'

interface SkillsProps {
  data: SkillsComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function Skills({ data, isPreviewMode, onUpdate }: SkillsProps) {
  const [newSkill, setNewSkill] = React.useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      onUpdate({
        ...data,
        skills: [...data.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = data.skills.filter((_, i) => i !== index);
    onUpdate({ ...data, skills: newSkills });
  };

  const getAlignmentClass = () => {
    const alignment = data.alignment || 'left';
    if (alignment === 'left') return 'justify-start';
    if (alignment === 'right') return 'justify-end';
    return 'justify-center';
  };

  const getVariantStyles = (variant: string = 'pill') => {
    switch (variant) {
      case 'badge':
        return {
          container: 'bg-white dark:bg-gray-900 border border-border rounded-lg px-4 py-2.5 text-xs font-medium shadow-sm',
          text: 'text-xs',
          color: 'var(--palette-title)',
        };
      case 'minimal':
        return {
          container: 'bg-muted/50 rounded-md px-4 py-2 text-xs font-medium',
          text: 'text-xs',
          color: 'var(--palette-title)',
        };
      case 'outlined':
        return {
          container: 'bg-transparent border-2 rounded-full px-5 py-2.5 text-xs font-semibold',
          text: 'text-xs',
          color: 'var(--palette-title)',
          borderColor: 'var(--palette-title)',
        };
      case 'pill':
      default:
        return {
          container: 'bg-white dark:bg-gray-900 border border-border rounded-full px-5 py-2.5 text-xs font-medium shadow-sm',
          text: 'text-xs',
          color: 'var(--palette-title)',
        };
    }
  };

  if (isPreviewMode) {
    if (data.skills.length === 0) return null;
    
    const variant = data.variant || 'pill';
    const variantStyles = getVariantStyles(variant);
    const alignment = getAlignmentClass();
    const componentStyles = (data as any).styles || {};
    const gap = (data as any).gap || '8px';
    const textColor = componentStyles.color || variantStyles.color;
    const backgroundColor = componentStyles.backgroundColor || (variantStyles.container.includes('bg-white') ? '#ffffff' : undefined);
    const borderColor = componentStyles.borderColor || variantStyles.borderColor || 'rgba(var(--primary-rgb, 0,0,0), 0.1)';
    const borderRadius = componentStyles.borderRadius || '24px';
    const borderWidth = componentStyles.borderWidth || '1px';
    const padding = componentStyles.padding || '8px';
    
    return (
      <div className={`max-w-2xl mx-auto`}>
        <div className={`flex flex-wrap ${alignment}`} style={{ gap }}>
          {data.skills.map((skill, index) => (
            <div 
              key={index} 
              className="transition-all duration-200 hover:scale-105"
              style={{ 
                color: textColor,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: borderWidth,
                borderStyle: 'solid',
                borderRadius: borderRadius,
                padding: padding,
              }}
            >
              <span className="text-xs font-medium">{skill}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className="flex items-center gap-4 pb-2 border-b">
        <label className="text-sm font-medium">Alignment:</label>
        <select
          value={data.alignment || 'left'}
          onChange={(e) => onUpdate({ ...data, alignment: e.target.value as 'left' | 'center' | 'right' })}
          className="px-3 py-2 rounded-md border border-border bg-background text-sm"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
        <label className="text-sm font-medium ml-4">Style:</label>
        <select
          value={data.variant || 'pill'}
          onChange={(e) => onUpdate({ ...data, variant: e.target.value as 'pill' | 'badge' | 'minimal' | 'outlined' })}
          className="px-3 py-2 rounded-md border border-border bg-background text-sm"
        >
          <option value="pill">Pill</option>
          <option value="badge">Badge</option>
          <option value="minimal">Minimal</option>
          <option value="outlined">Outlined</option>
        </select>
      </div>

      <div className="flex gap-2">
        <Input
          className="h-12 block border-0 focus:ring-0 focus:border-0 w-full focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Add your skills"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddSkill();
            }
          }}
        />
        <Button onClick={handleAddSkill} disabled={!newSkill.trim()}>
          Add
        </Button>
      </div>
      
      {data.skills.length > 0 && (
        <div className={`flex flex-wrap gap-2 ${getAlignmentClass()} p-2`}>
          {data.skills.map((skill, index) => {
            const variant = data.variant || 'pill';
            const styles = getVariantStyles(variant);
            
            return (
              <div 
                key={index} 
                className={`${styles.container} flex items-center gap-2 group`}
                style={{ 
                  color: styles.color,
                  borderColor: styles.borderColor || 'rgba(var(--primary-rgb, 0,0,0), 0.1)',
                }}
              >
                <span className={styles.text}>{skill}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveSkill(index)}
                  style={{ 
                    color: styles.color,
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}

export default Skills
