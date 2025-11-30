import React from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Plus, X, Search, ArrowRight, Mail, Phone, Globe, MapPin, Calendar, Github, Twitter, Linkedin, Instagram, Facebook, Youtube, Zap, Star, Heart, Download, ExternalLink } from 'lucide-react'
import { ButtonComponentData, ComponentData } from '@/lib/editor-state'

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  'search': Search,
  'arrow-right': ArrowRight,
  'mail': Mail,
  'phone': Phone,
  'globe': Globe,
  'map-pin': MapPin,
  'calendar': Calendar,
  'github': Github,
  'twitter': Twitter,
  'linkedin': Linkedin,
  'instagram': Instagram,
  'facebook': Facebook,
  'youtube': Youtube,
  'zap': Zap,
  'star': Star,
  'heart': Heart,
  'download': Download,
  'external-link': ExternalLink,
};

interface CTAButtonProps {
  data: ButtonComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function CTAButton({ data, isPreviewMode, onUpdate }: CTAButtonProps) {
  const componentStyles = (data as any).styles || {};

  const resolveBoxShadow = (value?: string) => {
    switch (value) {
      case "sm":
        return "0 1px 2px rgba(15, 23, 42, 0.08)";
      case "md":
        return "0 4px 6px rgba(15, 23, 42, 0.1)";
      case "lg":
        return "0 12px 20px rgba(15, 23, 42, 0.12)";
      case "none":
        return "none";
      default:
        return value;
    }
  };

  const optionalFields: Array<keyof ButtonComponentData["buttons"][number]> = [
    'icon',
    'displayMode',
    'iconPlacement',
    'iconColor',
    'customIcon',
    'width',
    'height',
    'paddingX',
    'paddingY',
    'contentAlign',
  ];

  const handleButtonChange = (
    index: number,
    field: keyof ButtonComponentData["buttons"][number],
    value: string | undefined
  ) => {
    const newButtons = [...data.buttons];
    const sanitizedValue =
      optionalFields.includes(field) && (value === '' || value === undefined)
        ? undefined
        : value;
    newButtons[index] = { ...newButtons[index], [field]: sanitizedValue as never };
    onUpdate({ ...data, buttons: newButtons });
  };

  const handleAddButton = () => {
    if (data.buttons.length < 2) {
      onUpdate({
        ...data,
        buttons: [...data.buttons, { text: 'Button', link: '#', variant: 'outline' }],
      });
    }
  };

  const handleRemoveButton = (index: number) => {
    if (data.buttons.length > 1) {
      const newButtons = data.buttons.filter((_, i) => i !== index);
      onUpdate({ ...data, buttons: newButtons });
    }
  };

  const getAlignmentClass = () => {
    const alignment = data.alignment || 'left';
    if (alignment === 'center') return 'justify-center';
    if (alignment === 'right') return 'justify-end';
    return 'justify-start';
  };

  const getButtonContentClass = (btn: ButtonComponentData["buttons"][number]) => {
    const align = btn.contentAlign || 'center';
    if (align === 'left') return 'justify-start text-left';
    if (align === 'right') return 'justify-end text-right';
    return 'justify-center text-center';
  };

  const handleButtonClick = (link?: string, openInNewTab?: boolean) => {
    if (!link || typeof window === 'undefined') return;
    if (openInNewTab) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      window.location.assign(link);
    }
  };

  const handleCustomIconUpload = (
    index: number,
    file?: File | null
  ) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      handleButtonChange(index, 'customIcon', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (isPreviewMode) {
    return (
      <div className={`flex flex-wrap gap-4 ${getAlignmentClass()}`}>
        {data.buttons.map((btn, index) => {
          const isPrimary = btn.variant === 'default' || !btn.variant;
          const IconComponent = btn.icon ? iconMap[btn.icon] : null;
          const hasCustomIcon = Boolean(btn.customIcon);
          const displayMode = btn.displayMode || (btn.hasIcon ? 'both' : 'text');
          const iconPlacement = btn.iconPlacement || btn.iconPosition || 'left';
          const shouldShowIcon =
            displayMode !== 'text' && (IconComponent || hasCustomIcon);
          const shouldShowText = displayMode !== 'icon';

          const componentStyle: React.CSSProperties = {
            width: componentStyles.width,
            height: componentStyles.height,
            padding: componentStyles.padding,
            paddingLeft: componentStyles.paddingLeft,
            paddingRight: componentStyles.paddingRight,
            paddingTop: componentStyles.paddingTop,
            paddingBottom: componentStyles.paddingBottom,
            backgroundColor: componentStyles.backgroundColor,
            color: componentStyles.color,
            borderRadius: componentStyles.borderRadius,
            borderWidth: componentStyles.borderWidth,
            borderColor: componentStyles.borderColor,
            borderStyle: componentStyles.borderStyle,
            boxShadow: resolveBoxShadow(componentStyles.boxShadow),
          };

          const baseStyle: React.CSSProperties = {
            ...componentStyle,
            width: btn.width || componentStyle.width || undefined,
            height: btn.height || componentStyle.height || undefined,
            borderRadius:
              componentStyle.borderRadius || 'var(--palette-radius, 0.5rem)',
          };

          if (componentStyles.padding && !btn.paddingX && !btn.paddingY) {
            baseStyle.padding = componentStyles.padding;
          }

          if (btn.paddingX) {
            baseStyle.padding = undefined;
            baseStyle.paddingLeft = btn.paddingX;
            baseStyle.paddingRight = btn.paddingX;
          } else if (componentStyles.paddingLeft || componentStyles.paddingRight) {
            baseStyle.paddingLeft =
              componentStyles.paddingLeft || baseStyle.paddingLeft;
            baseStyle.paddingRight =
              componentStyles.paddingRight || baseStyle.paddingRight;
          }

  if (btn.paddingY) {
            baseStyle.padding = undefined;
            baseStyle.paddingTop = btn.paddingY;
            baseStyle.paddingBottom = btn.paddingY;
          } else if (componentStyles.paddingTop || componentStyles.paddingBottom) {
            baseStyle.paddingTop =
              componentStyles.paddingTop || baseStyle.paddingTop;
            baseStyle.paddingBottom =
              componentStyles.paddingBottom || baseStyle.paddingBottom;
          }

          if (isPrimary) {
            baseStyle.backgroundColor =
              baseStyle.backgroundColor || 'var(--palette-primary)';
            baseStyle.color = baseStyle.color || '#ffffff';
          }

          const iconColor =
            btn.iconColor ||
            (isPrimary
              ? '#ffffff'
              : componentStyles.color || 'var(--palette-primary)');

          const iconElement = shouldShowIcon
            ? hasCustomIcon
              ? (
                <img
                  src={btn.customIcon}
                  alt="custom icon"
                  className="h-4 w-4 object-contain"
                />
                )
              : IconComponent && (
                <IconComponent
                  className="size-4"
                  style={{ color: iconColor }}
                />
                )
            : null;
          return (
            <Button
              key={index}
              variant={btn.variant || 'default'}
              className="transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              style={baseStyle}
              onClick={() => handleButtonClick(btn.link, btn.openInNewTab)}
            >
              <span
                className={`inline-flex w-full items-center gap-2 ${getButtonContentClass(btn)}`}
              >
                {iconPlacement !== 'right' && iconElement}
                {shouldShowText && (
                  <span
                    style={
                      isPrimary
                        ? { color: '#ffffff', fontWeight: 600 }
                        : undefined
                    }
                  >
                    {btn.text || 'Button'}
                  </span>
                )}
                {iconPlacement === 'right' && iconElement}
              </span>
            </Button>
          );
        })}
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
      </div>
      {data.buttons.map((btn, index) => {
        const IconComponent = btn.icon ? iconMap[btn.icon] : null;
        return (
          <div key={index} className='flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/40 p-4'>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Button text"
                value={btn.text}
                onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
                className="flex-1 min-w-[140px]"
              />
              <Input
                placeholder="Link URL"
                value={btn.link}
                onChange={(e) => handleButtonChange(index, 'link', e.target.value)}
                className="flex-1 min-w-[140px]"
              />
              <select
                value={btn.variant || 'default'}
                onChange={(e) => handleButtonChange(index, 'variant', e.target.value)}
                className="px-3 py-2 rounded-md border border-border bg-background text-sm"
              >
                <option value="default">Primary</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost</option>
                <option value="destructive">Destructive</option>
              </select>
              <select
                value={btn.displayMode || 'both'}
                onChange={(e) => handleButtonChange(index, 'displayMode', e.target.value)}
                className="px-3 py-2 rounded-md border border-border bg-background text-sm"
              >
                <option value="text">Text only</option>
                <option value="icon">Icon only</option>
                <option value="both">Icon + Text</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={btn.icon || ''}
                onChange={(e) => handleButtonChange(index, 'icon', e.target.value)}
                className="px-3 py-2 rounded-md border border-border bg-background text-sm"
              >
                <option value="">Default icon set</option>
                {Object.keys(iconMap).map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <select
                value={btn.iconPlacement || 'left'}
                onChange={(e) => handleButtonChange(index, 'iconPlacement', e.target.value)}
                className="px-3 py-2 rounded-md border border-border bg-background text-sm"
              >
                <option value="left">Icon left</option>
                <option value="right">Icon right</option>
              </select>
              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                Icon color
                <input
                  type="color"
                  value={btn.iconColor || '#000000'}
                  onChange={(e) => handleButtonChange(index, 'iconColor', e.target.value)}
                  className="h-8 w-12 cursor-pointer rounded-md border border-border bg-background"
                />
              </label>
              <label className="flex flex-1 flex-col text-xs font-medium text-muted-foreground">
                Upload custom icon (SVG/PNG)
                <input
                  type="file"
                  accept=".svg,image/svg+xml,image/png,image/jpeg"
                  onChange={(e) => handleCustomIconUpload(index, e.target.files?.[0])}
                  className="mt-1 text-xs"
                />
              </label>
              {btn.customIcon && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleButtonChange(index, 'customIcon', undefined)}
                >
                  Remove upload
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Input
                placeholder="Width (e.g. 180px or 100%)"
                value={btn.width || ''}
                onChange={(e) => handleButtonChange(index, 'width', e.target.value)}
                className="flex-1 min-w-[140px]"
              />
              <Input
                placeholder="Height (e.g. 48px)"
                value={btn.height || ''}
                onChange={(e) => handleButtonChange(index, 'height', e.target.value)}
                className="flex-1 min-w-[140px]"
              />
              <Input
                placeholder="Padding X (e.g. 1.5rem)"
                value={btn.paddingX || ''}
                onChange={(e) => handleButtonChange(index, 'paddingX', e.target.value)}
                className="flex-1 min-w-[140px]"
              />
              <Input
                placeholder="Padding Y (e.g. 0.75rem)"
                value={btn.paddingY || ''}
                onChange={(e) => handleButtonChange(index, 'paddingY', e.target.value)}
                className="flex-1 min-w-[140px]"
              />
              <select
                value={btn.contentAlign || 'center'}
                onChange={(e) => handleButtonChange(index, 'contentAlign', e.target.value)}
                className="px-3 py-2 rounded-md border border-border bg-background text-sm"
              >
                <option value="left">Align Left</option>
                <option value="center">Align Center</option>
                <option value="right">Align Right</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              {IconComponent && <IconComponent className="size-4 text-muted-foreground" />}
              {data.buttons.length > 1 && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoveButton(index)}
                  className="h-9 w-9"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
      {data.buttons.length < 2 && (
        <Button
          variant="outline"
          onClick={handleAddButton}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Button
        </Button>
      )}
    </div>
  );
}

export default CTAButton