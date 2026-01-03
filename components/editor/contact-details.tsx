import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { 
  Mail, Phone, MapPin, Globe, Calendar, 
  Plus, Trash2, Link as LinkIcon, 
  Twitter, Linkedin, Github, Instagram, Facebook, Youtube
} from "lucide-react";
import { ContactDetailsComponentData, ComponentData } from "@/lib/editor-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContactDetailsProps {
  data: ContactDetailsComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

const ICON_MAP: Record<string, any> = {
  mail: Mail,
  phone: Phone,
  map: MapPin,
  globe: Globe,
  calendar: Calendar,
  link: LinkIcon,
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
};

function ContactDetails({ data, isPreviewMode, onUpdate }: ContactDetailsProps) {
  const variant = data.variant || 'default';
  const alignment = data.alignment || 'left';
  const iconStyle = data.iconStyle || 'default';
  const customFields = data.customFields || [];

  const getIcon = (iconName: string) => {
    return ICON_MAP[iconName] || LinkIcon;
  };

  if (isPreviewMode) {
    const items = [
      { icon: Mail, label: 'Email', value: data.email, type: 'email' },
      { icon: Phone, label: 'Phone', value: data.phone, type: 'phone' },
      { icon: MapPin, label: 'Location', value: data.location, type: 'text' },
      { icon: Globe, label: 'Website', value: data.website, type: 'link' },
      { icon: Calendar, label: 'Availability', value: data.availability, type: 'text' },
      ...customFields.map(field => ({
        icon: getIcon(field.icon),
        label: field.label,
        value: field.value,
        type: field.type
      }))
    ].filter(item => item.value);

    if (items.length === 0) return null;

    const containerStyle = {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start',
      gap: variant === 'inline' ? '1.5rem' : '1rem',
    };

    const getIconStyle = () => {
      if (iconStyle === 'none') return {};
      
      const baseStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2.5rem',
        height: '2.5rem',
        flexShrink: 0,
        transition: 'all 0.2s',
      };

      if (iconStyle === 'circle') {
        return {
          ...baseStyle,
          backgroundColor: 'var(--palette-primary)',
          color: '#fff',
          borderRadius: '50%',
        };
      }

      if (iconStyle === 'square') {
        return {
          ...baseStyle,
          backgroundColor: 'var(--palette-primary)',
          color: '#fff',
          borderRadius: 'var(--palette-radius, 0.5rem)',
        };
      }

      // Default (no background, just icon color)
      return {
        color: 'var(--palette-primary)',
      };
    };

    const renderItem = (item: any, index: number) => {
      const href = 
        item.type === 'email' ? `mailto:${item.value}` :
        item.type === 'phone' ? `tel:${item.value}` :
        item.type === 'link' ? item.value : undefined;

      const Component = href ? 'a' : 'div';
      const props = href ? { href, target: item.type === 'link' ? '_blank' : undefined, rel: 'noopener noreferrer' } : {};

      if (variant === 'minimal') {
        return (
          <Component
            key={index}
            {...props}
            className="flex items-center gap-3 text-sm group hover:opacity-80 transition-opacity"
            style={{ 
              textDecoration: 'none', 
              color: 'var(--palette-description)',
              flexDirection: alignment === 'right' ? 'row-reverse' : 'row',
              textAlign: alignment === 'right' ? 'right' : 'left',
            }}
          >
            {iconStyle !== 'none' && (
              <item.icon className="size-4 shrink-0" style={{ color: 'var(--palette-primary)' }} />
            )}
            <span>{item.value}</span>
          </Component>
        );
      }

      if (variant === 'card') {
        return (
          <Component
            key={index}
            {...props}
            className="flex items-center gap-4 group transition-all hover:bg-background/50 p-3 rounded-lg -m-3 w-full"
            style={{ 
              textDecoration: 'none',
              flexDirection: alignment === 'right' ? 'row-reverse' : 'row',
              textAlign: alignment === 'right' ? 'right' : 'left',
            }}
          >
            {iconStyle !== 'none' && (
              <div 
                className={`flex items-center justify-center transition-all group-hover:scale-110 shadow-sm ${iconStyle === 'default' ? '' : 'p-3'}`}
                style={getIconStyle()}
              >
                <item.icon className="size-5" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-1">{item.label}</p>
              <p className="text-sm font-semibold group-hover:underline" style={{ color: 'var(--palette-title)' }}>
                {item.value}
              </p>
            </div>
          </Component>
        );
      }

      if (variant === 'inline') {
        return (
          <Component
            key={index}
            {...props}
            className="flex items-center gap-2.5 text-sm group hover:opacity-80 transition-all"
            style={{ 
              textDecoration: 'none', 
              color: 'var(--palette-description)',
            }}
          >
            {iconStyle !== 'none' && (
              <item.icon className="size-4 shrink-0" style={{ color: 'var(--palette-primary)' }} />
            )}
            <span className="font-medium">{item.value}</span>
          </Component>
        );
      }

      // Default variant
      return (
        <Component
          key={index}
          {...props}
          className="flex items-center gap-4 group transition-all hover:translate-x-1"
          style={{ 
            textDecoration: 'none',
            flexDirection: alignment === 'right' ? 'row-reverse' : 'row',
            textAlign: alignment === 'right' ? 'right' : 'left',
          }}
        >
          {iconStyle !== 'none' && (
            <div 
              className={`flex items-center justify-center transition-all group-hover:scale-110 ${iconStyle === 'default' ? '' : 'p-3'}`}
              style={getIconStyle()}
            >
              <item.icon className="size-5" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground mb-0.5">{item.label}</p>
            <p className="text-sm font-medium group-hover:underline" style={{ color: 'var(--palette-title)' }}>
              {item.value}
            </p>
          </div>
        </Component>
      );
    };

    if (variant === 'card') {
      return (
        <div 
          className="bg-linear-to-br from-background to-muted/50 border border-border rounded-xl p-6 space-y-4 shadow-sm" 
          style={{ 
            borderRadius: 'var(--palette-radius, 0.75rem)',
            ...containerStyle
          }}
        >
          {items.map((item, index) => renderItem(item, index))}
        </div>
      );
    }

    if (variant === 'inline') {
      return (
        <div className="flex flex-wrap gap-x-8 gap-y-4" style={{ justifyContent: alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start' }}>
          {items.map((item, index) => renderItem(item, index))}
        </div>
      );
    }

    return (
      <div style={containerStyle}>
        {items.map((item, index) => renderItem(item, index))}
      </div>
    );
  }

  const addCustomField = () => {
    const newField = {
      id: Math.random().toString(36).substr(2, 9),
      icon: 'link',
      label: 'Custom Link',
      value: '',
      type: 'link' as const,
    };
    onUpdate({ ...data, customFields: [...customFields, newField] });
  };

  const updateCustomField = (id: string, updates: any) => {
    const updatedFields = customFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    );
    onUpdate({ ...data, customFields: updatedFields });
  };

  const removeCustomField = (id: string) => {
    onUpdate({ ...data, customFields: customFields.filter(f => f.id !== id) });
  };

  // Canvas mode - show clean content only (reuse preview rendering)
  const items = [
    { icon: Mail, label: 'Email', value: data.email, type: 'email' },
    { icon: Phone, label: 'Phone', value: data.phone, type: 'phone' },
    { icon: MapPin, label: 'Location', value: data.location, type: 'text' },
    { icon: Globe, label: 'Website', value: data.website, type: 'link' },
    { icon: Calendar, label: 'Availability', value: data.availability, type: 'text' },
    ...customFields.map(field => ({
      icon: getIcon(field.icon),
      label: field.label,
      value: field.value,
      type: field.type
    }))
  ].filter(item => item.value);

  if (items.length === 0) return null;

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start',
    gap: variant === 'inline' ? '1.5rem' : '1rem',
  };

  const getIconStyle = () => {
    if (iconStyle === 'none') return {};
    
    const baseStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '2.5rem',
      height: '2.5rem',
      flexShrink: 0,
      transition: 'all 0.2s',
    };

    if (iconStyle === 'circle') {
      return {
        ...baseStyle,
        backgroundColor: 'var(--palette-primary)',
        color: '#fff',
        borderRadius: '50%',
      };
    }

    if (iconStyle === 'square') {
      return {
        ...baseStyle,
        backgroundColor: 'var(--palette-primary)',
        color: '#fff',
        borderRadius: 'var(--palette-radius, 0.5rem)',
      };
    }

    return {
      color: 'var(--palette-primary)',
    };
  };

  const renderItem = (item: any, index: number) => {
    const href = 
      item.type === 'email' ? `mailto:${item.value}` :
      item.type === 'phone' ? `tel:${item.value}` :
      item.type === 'link' ? item.value : undefined;

    const Component = href ? 'a' : 'div';
    const props = href ? { href, target: item.type === 'link' ? '_blank' : undefined, rel: 'noopener noreferrer' } : {};

    if (variant === 'minimal') {
      return (
        <Component
          key={index}
          {...props}
          className="flex items-center gap-3 text-sm group hover:opacity-80 transition-opacity"
          style={{ 
            textDecoration: 'none', 
            color: 'var(--palette-description)',
            flexDirection: alignment === 'right' ? 'row-reverse' : 'row',
            textAlign: alignment === 'right' ? 'right' : 'left',
          }}
        >
          {iconStyle !== 'none' && (
            <item.icon className="size-4 shrink-0" style={{ color: 'var(--palette-primary)' }} />
          )}
          <span>{item.value}</span>
        </Component>
      );
    }

    if (variant === 'card') {
      return (
        <Component
          key={index}
          {...props}
          className="flex items-center gap-4 group transition-all hover:bg-background/50 p-3 rounded-lg -m-3 w-full"
          style={{ 
            textDecoration: 'none',
            flexDirection: alignment === 'right' ? 'row-reverse' : 'row',
            textAlign: alignment === 'right' ? 'right' : 'left',
          }}
        >
          {iconStyle !== 'none' && (
            <div 
              className={`flex items-center justify-center transition-all group-hover:scale-110 shadow-sm ${iconStyle === 'default' ? '' : 'p-3'}`}
              style={getIconStyle()}
            >
              <item.icon className="size-5" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground mb-1">{item.label}</p>
            <p className="text-sm font-semibold group-hover:underline" style={{ color: 'var(--palette-title)' }}>
              {item.value}
            </p>
          </div>
        </Component>
      );
    }

    if (variant === 'inline') {
      return (
        <Component
          key={index}
          {...props}
          className="flex items-center gap-2.5 text-sm group hover:opacity-80 transition-all"
          style={{ 
            textDecoration: 'none', 
            color: 'var(--palette-description)',
          }}
        >
          {iconStyle !== 'none' && (
            <item.icon className="size-4 shrink-0" style={{ color: 'var(--palette-primary)' }} />
          )}
          <span className="font-medium">{item.value}</span>
        </Component>
      );
    }

    // Default variant
    return (
      <Component
        key={index}
        {...props}
        className="flex items-center gap-4 group transition-all hover:translate-x-1"
        style={{ 
          textDecoration: 'none',
          flexDirection: alignment === 'right' ? 'row-reverse' : 'row',
          textAlign: alignment === 'right' ? 'right' : 'left',
        }}
      >
        {iconStyle !== 'none' && (
          <div 
            className={`flex items-center justify-center transition-all group-hover:scale-110 ${iconStyle === 'default' ? '' : 'p-3'}`}
            style={getIconStyle()}
          >
            <item.icon className="size-5" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground mb-0.5">{item.label}</p>
          <p className="text-sm font-medium group-hover:underline" style={{ color: 'var(--palette-title)' }}>
            {item.value}
          </p>
        </div>
      </Component>
    );
  };

  if (variant === 'card') {
    return (
      <div 
        className="bg-linear-to-br from-background to-muted/50 border border-border rounded-xl p-6 space-y-4 shadow-sm" 
        style={{ 
          borderRadius: 'var(--palette-radius, 0.75rem)',
          ...containerStyle
        }}
      >
        {items.map((item, index) => renderItem(item, index))}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-x-8 gap-y-4" style={{ justifyContent: alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start' }}>
        {items.map((item, index) => renderItem(item, index))}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {items.map((item, index) => renderItem(item, index))}
    </div>
  );
}

export default ContactDetails;
