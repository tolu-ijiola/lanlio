import React from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Plus, X, Calendar, Building2, Briefcase, Award, Target, Rocket, Code, Star, Zap, Heart, Check, Circle, ArrowRight } from "lucide-react";
import { ComponentData } from "@/lib/editor-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  'building2': Building2,
  'briefcase': Briefcase,
  'award': Award,
  'target': Target,
  'rocket': Rocket,
  'code': Code,
  'star': Star,
  'zap': Zap,
  'heart': Heart,
  'check': Check,
  'circle': Circle,
  'arrow-right': ArrowRight,
};

interface ExperienceItem {
  position: string;
  company: string;
  period: string;
  description: string;
}

interface ExperienceComponentData {
  id: string;
  type: 'experience';
  experiences: ExperienceItem[];
}

interface ExperienceProps {
  data: ExperienceComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function Experience({ data, isPreviewMode, onUpdate }: ExperienceProps) {
  const [newExperience, setNewExperience] = React.useState<ExperienceItem>({
    position: '',
    company: '',
    period: '',
    description: '',
  });

  const handleAddExperience = () => {
    if (newExperience.position.trim() && newExperience.company.trim()) {
      onUpdate({
        ...data,
        experiences: [...data.experiences, { ...newExperience }],
      });
      setNewExperience({
        position: '',
        company: '',
        period: '',
        description: '',
      });
    }
  };

  const handleRemoveExperience = (index: number) => {
    const newExperiences = data.experiences.filter((_, i) => i !== index);
    onUpdate({ ...data, experiences: newExperiences });
  };

  const handleUpdateExperience = (index: number, field: keyof ExperienceItem, value: string) => {
    const newExperiences = [...data.experiences];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    onUpdate({ ...data, experiences: newExperiences });
  };

  // Preview mode - show only the preview
  if (isPreviewMode) {
    const variant = (data as any).variant || 'list';
    const spacing = (data as any).spacing || '24px';
    const customStyles = {
      icon: (data as any).icon || 'building2',
      iconColor: (data as any).iconColor || '',
      iconBackgroundColor: (data as any).iconBackgroundColor || '',
      itemBackgroundColor: (data as any).itemBackgroundColor || '',
      itemBorderColor: (data as any).itemBorderColor || '',
      itemBorderWidth: (data as any).itemBorderWidth || '',
    };
    
    if (data.experiences.length === 0) {
      return (
        <div className="max-w-5xl mx-auto">
          <div className="p-6 rounded-lg border border-dashed border-border/50 opacity-50 text-center">
            <Building2 className="size-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Add your work experience</p>
          </div>
        </div>
      );
    }

    const renderExperienceItem = (exp: ExperienceItem, index: number, variant: string, customStyles?: any) => {
      const iconName = customStyles?.icon || 'building2';
      const IconComponent = iconMap[iconName] || Building2;
      const iconColor = customStyles?.iconColor || '#ffffff';
      const iconBgColor = customStyles?.iconBackgroundColor || 'var(--palette-primary)';
      
      const itemStyles = {
        backgroundColor: customStyles?.itemBackgroundColor || undefined,
        borderColor: customStyles?.itemBorderColor || undefined,
        borderWidth: customStyles?.itemBorderWidth || undefined,
      };

      const styles = (data as any).styles || {};
      const titleColor = styles.color || 'var(--palette-title)';
      const companyColor = styles.companyColor || 'var(--palette-primary)';
      const descriptionColor = styles.descriptionColor || 'var(--palette-description)';
      const backgroundColor = itemStyles.backgroundColor || styles.backgroundColor || 'var(--palette-bg)';
      const borderColor = itemStyles.borderColor || styles.borderColor || 'rgba(var(--primary-rgb, 0,0,0), 0.1)';
      const borderRadius = styles.borderRadius || '12px';
      const borderWidth = itemStyles.borderWidth || styles.borderWidth || '1px';
      const padding = styles.padding || '24px';
      const boxShadow = styles.boxShadow;

      if (variant === 'timeline') {
        return (
          <div key={index} className="relative flex gap-6">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 z-10"
              style={{
                backgroundColor: iconBgColor,
                borderRadius: '9999px',
              }}
            >
              <IconComponent className="size-6" style={{ color: iconColor }} />
            </div>
            <div 
              className="flex-1 transition-all duration-300 hover:shadow-lg group"
              style={{
                backgroundColor: backgroundColor,
                borderRadius: borderRadius,
                borderColor: borderColor,
                borderWidth: borderWidth,
                borderStyle: 'solid',
                padding: padding,
                boxShadow: boxShadow,
              }}
            >
              <div className="space-y-3">
                <div>
                  <h4 
                    className="text-xl font-bold mb-1"
                    style={{ color: titleColor }}
                  >
                    {exp.position}
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p 
                      className="text-base font-medium"
                      style={{ color: companyColor }}
                    >
                      {exp.company}
                    </p>
                    {exp.period && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-4" style={{ color: descriptionColor }} />
                          <span 
                            className="text-sm"
                            style={{ color: descriptionColor }}
                          >
                            {exp.period}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {exp.description && (
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: descriptionColor }}
                  >
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      }

      if (variant === 'alternating') {
        const isLeft = index % 2 === 0;
        return (
          <div 
            key={index} 
            className={`flex gap-6 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: iconBgColor,
                borderRadius: '9999px',
              }}
            >
              <IconComponent className="size-6" style={{ color: iconColor }} />
            </div>
            <div 
              className="flex-1 transition-all duration-300 hover:shadow-lg group"
              style={{
                backgroundColor: backgroundColor,
                borderRadius: borderRadius,
                borderColor: borderColor,
                borderWidth: borderWidth,
                borderStyle: 'solid',
                padding: padding,
                boxShadow: boxShadow,
              }}
            >
              <div className="space-y-3">
                <div>
                  <h4 
                    className="text-xl font-bold mb-1"
                    style={{ color: titleColor }}
                  >
                    {exp.position}
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p 
                      className="text-base font-medium"
                      style={{ color: companyColor }}
                    >
                      {exp.company}
                    </p>
                    {exp.period && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-4" style={{ color: descriptionColor }} />
                          <span 
                            className="text-sm"
                            style={{ color: descriptionColor }}
                          >
                            {exp.period}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {exp.description && (
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: descriptionColor }}
                  >
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      }

      // Default list variant
      return (
        <div 
          key={index} 
          className="relative transition-all duration-300 hover:shadow-lg group"
          style={{
            backgroundColor: backgroundColor,
            borderRadius: borderRadius,
            borderColor: borderColor,
            borderWidth: borderWidth,
            borderStyle: 'solid',
            padding: padding,
            boxShadow: boxShadow,
          }}
        >
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
              style={{
                backgroundColor: iconBgColor,
                borderRadius: 'var(--palette-radius, 0.5rem)',
              }}
            >
              <IconComponent className="size-6" style={{ color: iconColor }} />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h4 
                  className="text-xl font-bold mb-1"
                  style={{ color: titleColor }}
                >
                  {exp.position}
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <p 
                    className="text-base font-medium"
                    style={{ color: companyColor }}
                  >
                    {exp.company}
                  </p>
                  {exp.period && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-4" style={{ color: descriptionColor }} />
                        <span 
                          className="text-sm"
                          style={{ color: descriptionColor }}
                        >
                          {exp.period}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {exp.description && (
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: descriptionColor }}
                >
                  {exp.description}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    };

    if (variant === 'timeline') {
      return (
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-8" style={{ gap: spacing }}>
            {data.experiences.map((exp, index) => renderExperienceItem(exp, index, variant, customStyles))}
          </div>
        </div>
      );
    }

    if (variant === 'alternating') {
      return (
        <div className="space-y-8 max-w-5xl mx-auto" style={{ gap: spacing }}>
          {data.experiences.map((exp, index) => renderExperienceItem(exp, index, variant, customStyles))}
        </div>
      );
    }

    // Default list variant
    return (
      <div className="space-y-6 max-w-5xl mx-auto" style={{ gap: spacing }}>
        {data.experiences.map((exp, index) => renderExperienceItem(exp, index, variant, customStyles))}
      </div>
    );
  }

  // Edit mode - show controls and preview
  const renderExperienceItem = (exp: ExperienceItem, index: number, variant: string, customStyles?: any) => {
    const iconName = customStyles?.icon || 'building2';
    const IconComponent = iconMap[iconName] || Building2;
    const iconColor = customStyles?.iconColor || '#ffffff';
    const iconBgColor = customStyles?.iconBackgroundColor || 'var(--palette-primary)';
    
    const itemStyles = {
      backgroundColor: customStyles?.itemBackgroundColor || undefined,
      borderColor: customStyles?.itemBorderColor || undefined,
      borderWidth: customStyles?.itemBorderWidth || undefined,
    };

    const styles = (data as any).styles || {};
    const titleColor = styles.color || 'var(--palette-title)';
    const companyColor = styles.companyColor || 'var(--palette-primary)';
    const descriptionColor = styles.descriptionColor || 'var(--palette-description)';
    const backgroundColor = itemStyles.backgroundColor || styles.backgroundColor || 'var(--palette-bg)';
    const borderColor = itemStyles.borderColor || styles.borderColor || 'rgba(var(--primary-rgb, 0,0,0), 0.1)';
    const borderRadius = styles.borderRadius || '12px';
    const borderWidth = itemStyles.borderWidth || styles.borderWidth || '1px';
    const padding = styles.padding || '24px';
    const boxShadow = styles.boxShadow;

    if (variant === 'timeline') {
      return (
        <div key={index} className="relative flex gap-6">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 z-10"
            style={{
              backgroundColor: iconBgColor,
              borderRadius: '9999px',
            }}
          >
            <IconComponent className="size-6" style={{ color: iconColor }} />
          </div>
          <div 
            className="flex-1 transition-all duration-300 hover:shadow-lg group"
            style={{
              backgroundColor: backgroundColor,
              borderRadius: borderRadius,
              borderColor: borderColor,
              borderWidth: borderWidth,
              borderStyle: 'solid',
              padding: padding,
              boxShadow: boxShadow,
            }}
          >
            <div className="space-y-3">
              <div>
                <h4 
                  className="text-xl font-bold mb-1"
                  style={{ color: titleColor }}
                >
                  {exp.position}
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <p 
                    className="text-base font-medium"
                    style={{ color: companyColor }}
                  >
                    {exp.company}
                  </p>
                  {exp.period && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-4" style={{ color: descriptionColor }} />
                        <span 
                          className="text-sm"
                          style={{ color: descriptionColor }}
                        >
                          {exp.period}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {exp.description && (
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: descriptionColor }}
                >
                  {exp.description}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (variant === 'alternating') {
      const isLeft = index % 2 === 0;
      return (
        <div 
          key={index} 
          className={`flex gap-6 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: iconBgColor,
              borderRadius: '9999px',
            }}
          >
            <IconComponent className="size-6" style={{ color: iconColor }} />
          </div>
          <div 
            className="flex-1 transition-all duration-300 hover:shadow-lg group"
            style={{
              backgroundColor: backgroundColor,
              borderRadius: borderRadius,
              borderColor: borderColor,
              borderWidth: borderWidth,
              borderStyle: 'solid',
              padding: padding,
              boxShadow: boxShadow,
            }}
          >
            <div className="space-y-3">
              <div>
                <h4 
                  className="text-xl font-bold mb-1"
                  style={{ color: titleColor }}
                >
                  {exp.position}
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <p 
                    className="text-base font-medium"
                    style={{ color: companyColor }}
                  >
                    {exp.company}
                  </p>
                  {exp.period && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-4" style={{ color: descriptionColor }} />
                        <span 
                          className="text-sm"
                          style={{ color: descriptionColor }}
                        >
                          {exp.period}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {exp.description && (
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: descriptionColor }}
                >
                  {exp.description}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Default list variant
    return (
      <div 
        key={index} 
        className="relative transition-all duration-300 hover:shadow-lg group"
        style={{
          backgroundColor: backgroundColor,
          borderRadius: borderRadius,
          borderColor: borderColor,
          borderWidth: borderWidth,
          borderStyle: 'solid',
          padding: padding,
          boxShadow: boxShadow,
        }}
      >
        <div className="flex items-start gap-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: iconBgColor,
              borderRadius: 'var(--palette-radius, 0.5rem)',
            }}
          >
            <IconComponent className="size-6" style={{ color: iconColor }} />
          </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h4 
                    className="text-xl font-bold mb-1"
                    style={{ color: titleColor }}
                  >
                    {exp.position}
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p 
                      className="text-base font-medium"
                      style={{ color: companyColor }}
                    >
                      {exp.company}
                    </p>
                    {exp.period && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-4" style={{ color: descriptionColor }} />
                          <span 
                            className="text-sm"
                            style={{ color: descriptionColor }}
                          >
                            {exp.period}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {exp.description && (
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: descriptionColor }}
                  >
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          </div>
    );
  };

  // Edit mode - show controls and preview
  const variant = (data as any).variant || 'list';
  const spacing = (data as any).spacing || '24px';
  const customStyles = {
    icon: (data as any).icon || 'building2',
    iconColor: (data as any).iconColor || '',
    iconBackgroundColor: (data as any).iconBackgroundColor || '',
    itemBackgroundColor: (data as any).itemBackgroundColor || '',
    itemBorderColor: (data as any).itemBorderColor || '',
    itemBorderWidth: (data as any).itemBorderWidth || '',
  };

  return (
    <div className="space-y-4">
      {/* Add Experience Form */}
      <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/20">
        <Label className="text-xs text-muted-foreground">Add Experience</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="text"
            value={newExperience.position}
            onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
            placeholder="Position"
            className="h-9 text-xs"
          />
          <Input
            type="text"
            value={newExperience.company}
            onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
            placeholder="Company"
            className="h-9 text-xs"
          />
        </div>
        <Input
          type="text"
          value={newExperience.period}
          onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
          placeholder="Period (e.g., Jan 2020 - Dec 2022)"
          className="h-9 text-xs"
        />
        <Textarea
          value={newExperience.description}
          onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
          placeholder="Description"
          className="min-h-[80px] text-xs"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddExperience}
          disabled={!newExperience.position.trim() || !newExperience.company.trim()}
          className="h-9 w-full"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Experience
        </Button>
      </div>

      {/* Variant Selector */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Layout</Label>
        <Select
          value={variant}
          onValueChange={(value: 'list' | 'timeline' | 'alternating') => {
            onUpdate({ ...data, variant: value } as any);
          }}
        >
          <SelectTrigger className="h-9 text-xs w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="list">List</SelectItem>
            <SelectItem value="timeline">Timeline</SelectItem>
            <SelectItem value="alternating">Alternating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Icon Controls */}
      <div className="space-y-3 pt-2 border-t border-border">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Icon</Label>
          <Select
            value={customStyles.icon}
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
              value={customStyles.iconColor || '#ffffff'}
              onChange={(e) => onUpdate({ ...data, iconColor: e.target.value } as any)}
              className="w-10 h-9 rounded border border-border cursor-pointer"
            />
            <Input
              type="text"
              value={customStyles.iconColor || ''}
              onChange={(e) => onUpdate({ ...data, iconColor: e.target.value } as any)}
              placeholder="#ffffff"
              className="flex-1 h-9 text-xs font-mono"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Icon Background</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={customStyles.iconBackgroundColor || '#000000'}
              onChange={(e) => onUpdate({ ...data, iconBackgroundColor: e.target.value } as any)}
              className="w-10 h-9 rounded border border-border cursor-pointer"
            />
            <Input
              type="text"
              value={customStyles.iconBackgroundColor || ''}
              onChange={(e) => onUpdate({ ...data, iconBackgroundColor: e.target.value } as any)}
              placeholder="var(--palette-primary)"
              className="flex-1 h-9 text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Item Styling */}
      <div className="space-y-3 pt-2 border-t border-border">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Item Background</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={customStyles.itemBackgroundColor || '#ffffff'}
              onChange={(e) => onUpdate({ ...data, itemBackgroundColor: e.target.value } as any)}
              className="w-10 h-9 rounded border border-border cursor-pointer"
            />
            <Input
              type="text"
              value={customStyles.itemBackgroundColor || ''}
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
              value={customStyles.itemBorderColor || '#e5e7eb'}
              onChange={(e) => onUpdate({ ...data, itemBorderColor: e.target.value } as any)}
              className="w-10 h-9 rounded border border-border cursor-pointer"
            />
            <Input
              type="text"
              value={customStyles.itemBorderColor || ''}
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
            value={customStyles.itemBorderWidth || ''}
            onChange={(e) => onUpdate({ ...data, itemBorderWidth: e.target.value } as any)}
            placeholder="1px"
            className="h-9 text-xs"
          />
        </div>
      </div>

      {/* Experiences List */}
      {data.experiences.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Experiences ({data.experiences.length})</Label>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {data.experiences.map((exp, index) => (
              <div
                key={index}
                className="flex items-start justify-between gap-2 p-3 rounded-md border border-border bg-background group"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{exp.position}</div>
                  <div className="text-xs text-muted-foreground truncate">{exp.company}</div>
                </div>
                <button
                  onClick={() => handleRemoveExperience(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
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
          {data.experiences.length === 0 ? (
            <div className="p-6 rounded-lg border border-dashed border-border/50 opacity-50 text-center">
              <Building2 className="size-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Add your work experience</p>
            </div>
          ) : variant === 'timeline' ? (
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-8">
                {data.experiences.slice(0, 3).map((exp, index) => renderExperienceItem(exp, index, variant, customStyles))}
              </div>
            </div>
          ) : variant === 'alternating' ? (
            <div className="space-y-8">
              {data.experiences.slice(0, 3).map((exp, index) => renderExperienceItem(exp, index, variant, customStyles))}
            </div>
          ) : (
            <div className="space-y-6">
              {data.experiences.slice(0, 3).map((exp, index) => renderExperienceItem(exp, index, variant, customStyles))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Experience;
