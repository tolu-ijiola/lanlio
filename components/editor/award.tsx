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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b">
        <h3 className="text-sm font-semibold">Awards</h3>
        <Button onClick={handleAddAward} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Award
        </Button>
      </div>
      
      {data.awards.map((award, index) => (
        <div key={index} className="p-4 border border-border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Award #{index + 1}</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleRemoveAward(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted group">
            {award.image ? (
              <>
                <img src={award.image} alt={award.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index)}
                    className="hidden"
                    id={`award-image-${index}`}
                  />
                  <label
                    htmlFor={`award-image-${index}`}
                    className="cursor-pointer"
                  >
                    <Button size="sm" variant="secondary">
                      <Upload className="h-4 w-4 mr-2" />
                      Change
                    </Button>
                  </label>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-yellow-400/20 to-orange-400/20">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, index)}
                  className="hidden"
                  id={`award-image-${index}`}
                />
                <label
                  htmlFor={`award-image-${index}`}
                  className="cursor-pointer"
                >
                  <Button size="sm" variant="ghost">
                    <Trophy className="size-8 text-yellow-500" />
                  </Button>
                </label>
              </div>
            )}
          </div>
          <Input
            placeholder="Award Title"
            value={award.title}
            onChange={(e) => handleUpdateAward(index, 'title', e.target.value)}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Organization"
              value={award.organization}
              onChange={(e) => handleUpdateAward(index, 'organization', e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Year"
              value={award.year}
              onChange={(e) => handleUpdateAward(index, 'year', e.target.value)}
              className="w-24"
            />
          </div>
          <Textarea
            placeholder="Description"
            value={award.description}
            onChange={(e) => handleUpdateAward(index, 'description', e.target.value)}
            rows={3}
          />
        </div>
      ))}
    </div>
  );
}

export default Award;
