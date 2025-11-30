import React from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { ComponentData } from "@/lib/editor-state";

interface Service {
  title: string;
  description: string;
  icon?: string;
}

interface ServicesComponentData {
  id: string;
  type: 'services';
  services: Service[];
}

interface ServicesProps {
  data: ServicesComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function Services({ data, isPreviewMode, onUpdate }: ServicesProps) {
  const [newService, setNewService] = React.useState<Service>({
    title: '',
    description: '',
    icon: '',
  });

  const handleAddService = () => {
    if (newService.title.trim() && newService.description.trim()) {
      onUpdate({
        ...data,
        services: [...data.services, { ...newService }],
      });
      setNewService({ title: '', description: '', icon: '' });
    }
  };

  const handleRemoveService = (index: number) => {
    const newServices = data.services.filter((_, i) => i !== index);
    onUpdate({ ...data, services: newServices });
  };

  const handleUpdateService = (index: number, field: keyof Service, value: string) => {
    const newServices = [...data.services];
    newServices[index] = { ...newServices[index], [field]: value };
    onUpdate({ ...data, services: newServices });
  };

  if (isPreviewMode) {
    if (data.services.length === 0) return null;
    
    const styles = (data as any).styles || {};
    const gap = (data as any).gap || '24px';
    const titleColor = styles.color || 'var(--palette-title)';
    const descriptionColor = styles.descriptionColor || 'var(--palette-description)';
    const iconBackgroundColor = styles.iconBackgroundColor || 'var(--palette-primary)';
    const backgroundColor = styles.backgroundColor || '#ffffff';
    const borderColor = styles.borderColor || '#e5e7eb';
    const borderRadius = styles.borderRadius || '12px';
    const borderWidth = styles.borderWidth || '1px';
    const padding = styles.padding || '24px';
    const boxShadow = styles.boxShadow;
    
    // Calculate grid columns based on service count
    const getGridCols = () => {
      const count = data.services.length;
      if (count === 1) return 'grid-cols-1';
      if (count === 2) return 'grid-cols-1 md:grid-cols-2';
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    };
    
    return (
      <div className={`grid ${getGridCols()}`} style={{ gap }}>
        {data.services.map((service, index) => (
          <div 
            key={index} 
            className="hover:shadow-lg transition-all duration-300 group space-y-4"
            style={{ 
              borderRadius: borderRadius,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderWidth: borderWidth,
              borderStyle: 'solid',
              padding: padding,
              boxShadow: boxShadow,
            }}
          >
            {service.icon && (
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: iconBackgroundColor,
                  color: '#ffffff',
                  borderRadius: borderRadius,
                }}
              >
                {service.icon}
              </div>
            )}
            <h3 
              className="text-xl font-bold"
              style={{ color: titleColor }}
            >
              {service.title}
            </h3>
            <p 
              className="text-sm leading-relaxed"
              style={{ color: descriptionColor }}
            >
              {service.description}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.services.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.services.map((service, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Service Title"
                    value={service.title}
                    onChange={(e) => handleUpdateService(index, 'title', e.target.value)}
                    className="h-10"
                  />
                  <Input
                    placeholder="Icon (emoji or text, optional)"
                    value={service.icon || ''}
                    onChange={(e) => handleUpdateService(index, 'icon', e.target.value)}
                    className="h-10"
                  />
                  <Textarea
                    placeholder="Service Description"
                    value={service.description}
                    onChange={(e) => handleUpdateService(index, 'description', e.target.value)}
                    rows={3}
                    className="h-20"
                  />
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoveService(index)}
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
          <Input
            placeholder="Service Title *"
            value={newService.title}
            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
            className="h-10"
          />
          <Input
            placeholder="Icon (emoji, optional)"
            value={newService.icon || ''}
            onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
            className="h-10"
          />
          <Textarea
            placeholder="Service Description *"
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            rows={3}
            className="h-20"
          />
        </div>
        <Button
          onClick={handleAddService}
          disabled={!newService.title.trim() || !newService.description.trim()}
          className="w-full"
        >
          <Plus className="mr-2" /> Add Service
        </Button>
      </div>
    </div>
  );
}

export default Services;

