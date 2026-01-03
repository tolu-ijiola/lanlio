import React, { useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Plus, FileImage, X, Trophy, Upload } from "lucide-react";
import { AwardComponentData, ComponentData } from "@/lib/editor-state";

interface AwardProps {
  data: AwardComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function Award({ data, isPreviewMode, onUpdate }: AwardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newAward, setNewAward] = React.useState({
    title: '',
    organization: '',
    year: '',
    description: '',
    image: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (index !== undefined) {
          const newAwards = [...data.awards];
          newAwards[index] = { ...newAwards[index], image: reader.result as string };
          onUpdate({ ...data, awards: newAwards });
        } else {
          setNewAward({ ...newAward, image: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAward = () => {
    if (newAward.title.trim()) {
      onUpdate({
        ...data,
        awards: [...data.awards, { ...newAward }],
      });
      setNewAward({ title: '', organization: '', year: '', description: '', image: '' });
    }
  };

  const handleRemoveAward = (index: number) => {
    const newAwards = data.awards.filter((_, i) => i !== index);
    onUpdate({ ...data, awards: newAwards });
  };

  const handleUpdateAward = (index: number, field: string, value: string) => {
    const newAwards = [...data.awards];
    newAwards[index] = { ...newAwards[index], [field]: value };
    onUpdate({ ...data, awards: newAwards });
  };

  if (isPreviewMode) {
    if (data.awards.length === 0) return null;
    
    const styles = (data as any).styles || {};
    const gap = (data as any).gap || '24px';
    const titleColor = styles.color || 'var(--palette-title)';
    const descriptionColor = styles.descriptionColor || 'var(--palette-description)';
    const backgroundColor = styles.backgroundColor || '#ffffff';
    const borderColor = styles.borderColor || '#e5e7eb';
    const borderRadius = styles.borderRadius || '12px';
    const borderWidth = styles.borderWidth || '1px';
    const padding = styles.padding || '16px';
    const boxShadow = styles.boxShadow;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap }}>
        {data.awards.map((award, index) => (
          <div 
            key={index} 
            className="space-y-3 transition-all duration-300 hover:shadow-lg"
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
            <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-muted">
              {award.image ? (
                <img src={award.image} alt={award.title} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-yellow-400/20 to-orange-400/20">
                  <Trophy className="size-16 text-yellow-500" />
                </div>
              )}
            </div>
            <h4 
              className="text-lg font-bold"
              style={{ color: titleColor }}
            >
              {award.title || 'Award Title'}
            </h4>
            {award.description && (
              <p 
                className="text-sm"
                style={{ color: descriptionColor }}
              >
                {award.description}
              </p>
            )}
            <p 
              className="text-xs"
              style={{ color: descriptionColor }}
            >
              {award.organization} {award.year && `• ${award.year}`}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // Canvas mode - show clean content only
  if (data.awards.length === 0) return null;
  
  const styles = (data as any).styles || {};
  const gap = (data as any).gap || '24px';
  const titleColor = styles.color || 'var(--palette-title)';
  const descriptionColor = styles.descriptionColor || 'var(--palette-description)';
  const backgroundColor = styles.backgroundColor || '#ffffff';
  const borderColor = styles.borderColor || '#e5e7eb';
  const borderRadius = styles.borderRadius || '12px';
  const borderWidth = styles.borderWidth || '1px';
  const padding = styles.padding || '16px';
  const boxShadow = styles.boxShadow;
  const variant = (data as any).variant || 'grid';
  
  // Card variant
  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap }}>
        {data.awards.map((award, index) => (
          <div 
            key={index} 
            className="space-y-3 transition-all duration-300 hover:shadow-lg"
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
            <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-muted">
              {award.image ? (
                <img src={award.image} alt={award.title} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-yellow-400/20 to-orange-400/20">
                  <Trophy className="size-16 text-yellow-500" />
                </div>
              )}
            </div>
            <h4 
              className="text-lg font-bold"
              style={{ color: titleColor }}
            >
              {award.title || 'Award Title'}
            </h4>
            {award.description && (
              <p 
                className="text-sm"
                style={{ color: descriptionColor }}
              >
                {award.description}
              </p>
            )}
            <p 
              className="text-xs"
              style={{ color: descriptionColor }}
            >
              {award.organization} {award.year && `• ${award.year}`}
            </p>
          </div>
        ))}
      </div>
    );
  }
  
  // List variant
  return (
    <div className="space-y-4">
      {data.awards.map((award, index) => (
        <div 
          key={index} 
          className="flex gap-4 items-start transition-all duration-300 hover:shadow-lg p-4 rounded-lg"
          style={{
            backgroundColor: backgroundColor,
            borderRadius: borderRadius,
            borderColor: borderColor,
            borderWidth: borderWidth,
            borderStyle: 'solid',
            boxShadow: boxShadow,
          }}
        >
          {award.image ? (
            <img src={award.image} alt={award.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" style={{ borderRadius: borderRadius }} />
          ) : (
            <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-lg flex-shrink-0" style={{ borderRadius: borderRadius }}>
              <Trophy className="size-8 text-yellow-500" />
            </div>
          )}
          <div className="flex-1">
            <h4 
              className="text-lg font-bold mb-1"
              style={{ color: titleColor }}
            >
              {award.title || 'Award Title'}
            </h4>
            <p 
              className="text-sm mb-1"
              style={{ color: descriptionColor }}
            >
              {award.organization} {award.year && `• ${award.year}`}
            </p>
            {award.description && (
              <p 
                className="text-sm"
                style={{ color: descriptionColor }}
              >
                {award.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Award;
