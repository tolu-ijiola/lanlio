import React from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Plus, X, Calendar, Building2 } from "lucide-react";
import { ComponentData } from "@/lib/editor-state";

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

  if (isPreviewMode) {
    if (data.experiences.length === 0) return null;
    
    const styles = (data as any).styles || {};
    const spacing = (data as any).spacing || '24px';
    const titleColor = styles.color || 'var(--palette-title)';
    const companyColor = styles.companyColor || 'var(--palette-primary)';
    const descriptionColor = styles.descriptionColor || 'var(--palette-description)';
    const backgroundColor = styles.backgroundColor || 'var(--palette-bg)';
    const borderColor = styles.borderColor || 'rgba(var(--primary-rgb, 0,0,0), 0.1)';
    const borderRadius = styles.borderRadius || '12px';
    const borderWidth = styles.borderWidth || '1px';
    const padding = styles.padding || '24px';
    const boxShadow = styles.boxShadow;
    
    return (
      <div className="space-y-6" style={{ gap: spacing }}>
        {data.experiences.map((exp, index) => (
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
                  backgroundColor: 'var(--palette-primary)',
                  borderRadius: 'var(--palette-radius, 0.5rem)',
                }}
              >
                <Building2 className="size-6 text-white" />
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
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {data.experiences.length > 0 && (
        <div className="space-y-6">
          {data.experiences.map((exp, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Position"
                      value={exp.position}
                      onChange={(e) => handleUpdateExperience(index, 'position', e.target.value)}
                      className="h-10"
                    />
                    <Input
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <Input
                    placeholder="Start - End Year (e.g., Apr 2023 – March 2025)"
                    value={exp.period}
                    onChange={(e) => handleUpdateExperience(index, 'period', e.target.value)}
                    className="h-10"
                  />
                  <Textarea
                    placeholder="Work done in company"
                    value={exp.description}
                    onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
                    rows={4}
                    className="min-h-[100px]"
                  />
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoveExperience(index)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Position *"
              value={newExperience.position}
              onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
              className="h-10"
            />
            <Input
              placeholder="Company *"
              value={newExperience.company}
              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
              className="h-10"
            />
          </div>
          <Input
            placeholder="Start - End Year (e.g., Apr 2023 – March 2025)"
            value={newExperience.period}
            onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
            className="h-10"
          />
          <Textarea
            placeholder="Work done in company"
            value={newExperience.description}
            onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
            rows={4}
            className="min-h-[100px]"
          />
        </div>
        <Button
          onClick={handleAddExperience}
          disabled={!newExperience.position.trim() || !newExperience.company.trim()}
          className="w-full"
        >
          <Plus className="mr-2" /> Add Experience
        </Button>
      </div>
    </div>
  );
}

export default Experience;
