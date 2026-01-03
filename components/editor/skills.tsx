import React from 'react'
import { Input } from '../ui/input'
import { X, Plus, Move, Grid3x3, LayoutList, ArrowRight, Check, Circle, Star, Zap, Heart, Code, Briefcase, Award, Target, Rocket } from 'lucide-react'
import { Button } from '../ui/button'
import { SkillsComponentData, ComponentData } from '@/lib/editor-state'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Label } from '../ui/label'
import { AlignmentControl } from '../ui/alignment-control'

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  'arrow-right': ArrowRight,
  'check': Check,
  'circle': Circle,
  'star': Star,
  'zap': Zap,
  'heart': Heart,
  'code': Code,
  'briefcase': Briefcase,
  'award': Award,
  'target': Target,
  'rocket': Rocket,
};

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

  const getLayoutClass = () => {
    const layout = (data as any).layout || 'horizontal';
    return layout;
  };

  const renderSkillItem = (skill: string, index: number, variant: string, customStyles?: any) => {
    const iconName = customStyles?.icon || 'arrow-right';
    const IconComponent = iconMap[iconName] || ArrowRight;
    const iconColor = customStyles?.iconColor || 'currentColor';
    
    const baseStyles: React.CSSProperties = {
      transition: 'all 0.2s ease',
      ...(customStyles?.backgroundColor && { backgroundColor: customStyles.backgroundColor }),
      ...(customStyles?.borderColor && { borderColor: customStyles.borderColor }),
      ...(customStyles?.borderWidth && { borderWidth: customStyles.borderWidth }),
    };

    switch (variant) {
      case 'pills':
        return (
          <div
            key={index}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:scale-105 transition-all"
            style={baseStyles}
          >
            <span className="text-sm font-medium">{skill}</span>
          </div>
        );
      
      case 'outline':
        return (
          <div
            key={index}
            className="inline-flex items-center px-4 py-2 rounded-lg border-2 hover:text-primary transition-all hover:scale-105"
            style={baseStyles}
          >
            <span className="text-sm font-medium">{skill}</span>
          </div>
        );
      
      case 'list':
        return (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 transition-all group"
            style={baseStyles}
          >
            <IconComponent className="h-3 w-3 transition-colors" style={{ color: iconColor }} />
            <span className="text-sm font-medium">{skill}</span>
          </div>
        );
      
      case 'normal':
      default:
        return (
          <div
            key={index}
            className="inline-flex items-center px-4 py-2.5 rounded-lg hover:bg-muted text-foreground transition-all hover:scale-105"
            style={baseStyles}
          >
            <span className="text-sm font-medium">{skill}</span>
          </div>
        );
    }
  };

  if (isPreviewMode) {
    const variant = data.variant || 'normal';
    const layout = getLayoutClass();
    const alignment = data.alignment || 'left';
    const gap = (data as any).gap || '12px';
    const speed = (data as any).speed || 30;
    const customStyles = {
      icon: (data as any).icon || 'arrow-right',
      iconColor: (data as any).iconColor || '',
      backgroundColor: (data as any).itemBackgroundColor || '',
      borderColor: (data as any).itemBorderColor || '',
      borderWidth: (data as any).itemBorderWidth || '',
    };
    
    if (data.skills.length === 0) {
      return (
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            <div className="px-4 py-2 rounded-lg border border-dashed border-border/50 opacity-50">
              <span className="text-sm text-muted-foreground">Add your skills</span>
            </div>
          </div>
        </div>
      );
    }

    // Marquee Layout
    if (layout === 'marquee') {
      return (
        <>
          <style>{`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .marquee-container {
              display: flex;
              overflow: hidden;
              white-space: nowrap;
            }
            .marquee-content {
              display: inline-flex;
              animation: scroll ${speed}s linear infinite;
            }
            .marquee-content:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="marquee-container py-4">
            <div className="marquee-content" style={{ gap }}>
              {[...data.skills, ...data.skills].map((skill, index) => renderSkillItem(skill, index, variant, customStyles))}
            </div>
          </div>
        </>
      );
    }

    // Grid Layout
    if (layout === 'grid') {
      const alignmentClass = alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start';
      return (
        <div className="max-w-5xl mx-auto">
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 ${alignmentClass}`}>
            {data.skills.map((skill, index) => renderSkillItem(skill, index, variant, customStyles))}
          </div>
        </div>
      );
    }

    // Vertical Layout
    if (layout === 'vertical') {
      const alignmentClass = alignment === 'center' ? 'items-center' : alignment === 'right' ? 'items-end' : 'items-start';
      return (
        <div className="max-w-5xl mx-auto">
          <div className={`flex flex-col ${alignmentClass}`} style={{ gap }}>
            {data.skills.map((skill, index) => renderSkillItem(skill, index, variant, customStyles))}
          </div>
        </div>
      );
    }

    // Horizontal Layout (default)
    const alignmentClass = alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start';
    return (
      <div className="max-w-5xl mx-auto">
        <div className={`flex flex-wrap ${alignmentClass}`} style={{ gap }}>
          {data.skills.map((skill, index) => renderSkillItem(skill, index, variant, customStyles))}
        </div>
      </div>
    );
  }

  // Edit mode - show controls and preview
  const variant = data.variant || 'normal';
  const layout = getLayoutClass();
  const alignment = data.alignment || 'left';
  const gap = (data as any).gap || '12px';
  const speed = (data as any).speed || 30;

  return (
    <div className="space-y-4">
      {/* Add Skill Input */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Add Skill</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="Enter a skill"
            className="h-9 text-xs flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSkill}
            disabled={!newSkill.trim() || data.skills.includes(newSkill.trim())}
            className="h-9 px-3"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Style Selector */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Style</Label>
        <Select
          value={variant}
          onValueChange={(value: 'pills' | 'outline' | 'list' | 'normal') => {
            onUpdate({ ...data, variant: value });
          }}
        >
          <SelectTrigger className="h-9 text-xs w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="pills">Pills</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="list">List</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Layout Selector */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Layout</Label>
        <Select
          value={layout}
          onValueChange={(value: 'horizontal' | 'vertical' | 'grid' | 'marquee') => {
            onUpdate({ ...data, layout: value } as any);
          }}
        >
          <SelectTrigger className="h-9 text-xs w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="horizontal">
              <div className="flex items-center gap-2">
                <LayoutList className="h-3.5 w-3.5" />
                <span>Horizontal</span>
              </div>
            </SelectItem>
            <SelectItem value="vertical">
              <div className="flex items-center gap-2">
                <LayoutList className="h-3.5 w-3.5 rotate-90" />
                <span>Vertical</span>
              </div>
            </SelectItem>
            <SelectItem value="grid">
              <div className="flex items-center gap-2">
                <Grid3x3 className="h-3.5 w-3.5" />
                <span>Grid</span>
              </div>
            </SelectItem>
            <SelectItem value="marquee">
              <div className="flex items-center gap-2">
                <Move className="h-3.5 w-3.5" />
                <span>Marquee</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alignment Control - only for horizontal, vertical, and grid */}
      {layout !== 'marquee' && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Alignment</Label>
          <AlignmentControl
            value={alignment}
            onChange={(value) => onUpdate({ ...data, alignment: value })}
          />
        </div>
      )}

      {/* Marquee Speed Control */}
      {layout === 'marquee' && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Speed</Label>
          <Input
            type="number"
            min="5"
            max="100"
            value={speed}
            onChange={(e) => {
              const value = Math.max(5, Math.min(100, Number(e.target.value) || 30));
              onUpdate({ ...data, speed: value } as any);
            }}
            className="h-9 text-xs"
            placeholder="30"
          />
          <p className="text-xs text-muted-foreground">Lower = faster (5-100)</p>
        </div>
      )}

      {/* Icon Controls - Only for List style */}
      {variant === 'list' && (
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Icon</Label>
            <Select
              value={(data as any).icon || 'arrow-right'}
              onValueChange={(value) => {
                onUpdate({ ...data, icon: value } as any);
              }}
            >
              <SelectTrigger className="h-9 text-xs w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(iconMap).map(([key, Icon]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5" />
                      <span className="capitalize">{key.replace('-', ' ')}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Icon Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={(data as any).iconColor || '#6b7280'}
                onChange={(e) => onUpdate({ ...data, iconColor: e.target.value } as any)}
                className="w-10 h-9 rounded border border-border cursor-pointer"
              />
              <Input
                type="text"
                value={(data as any).iconColor || ''}
                onChange={(e) => onUpdate({ ...data, iconColor: e.target.value } as any)}
                placeholder="#6b7280"
                className="flex-1 h-9 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Item Styling - Border and Background */}
      <div className="space-y-3 pt-2 border-t border-border">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Item Background</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={(data as any).itemBackgroundColor || '#ffffff'}
              onChange={(e) => onUpdate({ ...data, itemBackgroundColor: e.target.value } as any)}
              className="w-10 h-9 rounded border border-border cursor-pointer"
            />
            <Input
              type="text"
              value={(data as any).itemBackgroundColor || ''}
              onChange={(e) => onUpdate({ ...data, itemBackgroundColor: e.target.value } as any)}
              placeholder="transparent or #ffffff"
              className="flex-1 h-9 text-xs font-mono"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Item Border Color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={(data as any).itemBorderColor || '#e5e7eb'}
              onChange={(e) => onUpdate({ ...data, itemBorderColor: e.target.value } as any)}
              className="w-10 h-9 rounded border border-border cursor-pointer"
            />
            <Input
              type="text"
              value={(data as any).itemBorderColor || ''}
              onChange={(e) => onUpdate({ ...data, itemBorderColor: e.target.value } as any)}
              placeholder="#e5e7eb"
              className="flex-1 h-9 text-xs font-mono"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Item Border Width</Label>
          <Input
            type="text"
            value={(data as any).itemBorderWidth || ''}
            onChange={(e) => onUpdate({ ...data, itemBorderWidth: e.target.value } as any)}
            placeholder="1px"
            className="h-9 text-xs"
          />
        </div>
      </div>

      {/* Skills List */}
      {data.skills.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Skills ({data.skills.length})</Label>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background group"
              >
                <span className="text-xs">{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="pt-3 border-t border-border">
        <Label className="text-xs text-muted-foreground mb-2 block">Preview</Label>
        <div className="max-w-5xl mx-auto">
          {data.skills.length === 0 ? (
            <div className="flex flex-wrap justify-center gap-3">
              <div className="px-4 py-2 rounded-lg border border-dashed border-border/50 opacity-50">
                <span className="text-sm text-muted-foreground">Add your skills</span>
              </div>
            </div>
          ) : layout === 'marquee' ? (
            <>
              <style>{`
                @keyframes scroll {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .marquee-container {
                  display: flex;
                  overflow: hidden;
                  white-space: nowrap;
                }
                .marquee-content {
                  display: inline-flex;
                  animation: scroll ${speed}s linear infinite;
                }
                .marquee-content:hover {
                  animation-play-state: paused;
                }
              `}</style>
              <div className="marquee-container py-4">
                <div className="marquee-content" style={{ gap }}>
                  {[...data.skills.slice(0, 6), ...data.skills.slice(0, 6)].map((skill, index) => {
                    const customStyles = {
                      icon: (data as any).icon || 'arrow-right',
                      iconColor: (data as any).iconColor || '',
                      backgroundColor: (data as any).itemBackgroundColor || '',
                      borderColor: (data as any).itemBorderColor || '',
                      borderWidth: (data as any).itemBorderWidth || '',
                    };
                    return renderSkillItem(skill, index, variant, customStyles);
                  })}
                </div>
              </div>
            </>
          ) : layout === 'grid' ? (
            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 ${alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
              {data.skills.slice(0, 8).map((skill, index) => {
                const customStyles = {
                  icon: (data as any).icon || 'arrow-right',
                  iconColor: (data as any).iconColor || '',
                  backgroundColor: (data as any).itemBackgroundColor || '',
                  borderColor: (data as any).itemBorderColor || '',
                  borderWidth: (data as any).itemBorderWidth || '',
                };
                return renderSkillItem(skill, index, variant, customStyles);
              })}
            </div>
          ) : layout === 'vertical' ? (
            <div className={`flex flex-col ${alignment === 'center' ? 'items-center' : alignment === 'right' ? 'items-end' : 'items-start'}`} style={{ gap }}>
              {data.skills.slice(0, 5).map((skill, index) => {
                const customStyles = {
                  icon: (data as any).icon || 'arrow-right',
                  iconColor: (data as any).iconColor || '',
                  backgroundColor: (data as any).itemBackgroundColor || '',
                  borderColor: (data as any).itemBorderColor || '',
                  borderWidth: (data as any).itemBorderWidth || '',
                };
                return renderSkillItem(skill, index, variant, customStyles);
              })}
            </div>
          ) : (
            <div className={`flex flex-wrap ${alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start'}`} style={{ gap }}>
              {data.skills.slice(0, 6).map((skill, index) => {
                const customStyles = {
                  icon: (data as any).icon || 'arrow-right',
                  iconColor: (data as any).iconColor || '',
                  backgroundColor: (data as any).itemBackgroundColor || '',
                  borderColor: (data as any).itemBorderColor || '',
                  borderWidth: (data as any).itemBorderWidth || '',
                };
                return renderSkillItem(skill, index, variant, customStyles);
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Skills
