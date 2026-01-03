import React from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { MetricInput } from '../ui/metric-input'
import { Plus, X, Search, ArrowRight, Mail, Phone, Globe, MapPin, Calendar, Github, Twitter, Linkedin, Instagram, Facebook, Youtube, Zap, Star, Heart, Download, ExternalLink, LayoutGrid, LayoutList } from 'lucide-react'
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
  designPalette?: {
    primaryColor?: string;
    backgroundColor?: string;
    titleColor?: string;
  };
}

function CTAButton({ data, isPreviewMode, onUpdate, designPalette }: CTAButtonProps) {
  const componentStyles = (data as any).styles || {};
  
  // Create style element to override !important CSS rules for button text color, hover color, and border radius
  const styleId = `button-styles-${data.id}`;
  // Default to white for button text color if not set
  const buttonTextColor = componentStyles.color || '#ffffff';
  const buttonHoverTextColor = componentStyles.hoverTextColor || componentStyles.color || '#ffffff';
  const buttonHoverBackgroundColor = componentStyles.hoverBackgroundColor || componentStyles.backgroundColor || '';
  const buttonBorderRadius = componentStyles.borderRadius || '';
  
  React.useEffect(() => {
    if (isPreviewMode) {
      const styleEl = document.getElementById(styleId) || document.createElement('style');
      styleEl.id = styleId;
      
      // Use extremely specific selectors to override ALL CSS rules
      // Target the wrapper div's data attributes and all nested elements
      // Use multiple attribute selectors for maximum specificity
      let styleContent = `
        /* Normal state - text color - MAXIMUM SPECIFICITY */
        div[data-button-id="${data.id}"][data-editor-component] button,
        div[data-button-id="${data.id}"][data-editor-component] button:not([class*="ghost"]):not([class*="outline"]),
        div[data-button-id="${data.id}"][data-editor-component] button[class*="outline"],
        div[data-button-id="${data.id}"][data-editor-component] button[class*="ghost"],
        div[data-button-id="${data.id}"][data-editor-component] button span,
        div[data-button-id="${data.id}"][data-editor-component] button span span,
        div[data-button-id="${data.id}"][data-editor-component] button *,
        div[data-button-id="${data.id}"][data-editor-component] button[style*="background"],
        div[data-button-id="${data.id}"][data-editor-component] button[style*="background"] span,
        div[data-button-id="${data.id}"][data-editor-component] button[style*="background"] *,
        div[data-button-id="${data.id}"][data-editor-component] button[style*="color"],
        div[data-button-id="${data.id}"][data-editor-component] button[style*="color"] span,
        div[data-button-id="${data.id}"][data-editor-component] button[style*="color"] *,
        [data-button-id="${data.id}"][data-editor-component] button,
        [data-button-id="${data.id}"][data-editor-component] button:not([class*="ghost"]):not([class*="outline"]),
        [data-button-id="${data.id}"][data-editor-component] button[class*="outline"],
        [data-button-id="${data.id}"][data-editor-component] button[class*="ghost"],
        [data-button-id="${data.id}"][data-editor-component] button span,
        [data-button-id="${data.id}"][data-editor-component] button span span,
        [data-button-id="${data.id}"][data-editor-component] button * {
          color: ${buttonTextColor} !important;
        }
        
        /* Hover state - text color - MAXIMUM SPECIFICITY */
        div[data-button-id="${data.id}"][data-editor-component] button:hover,
        div[data-button-id="${data.id}"][data-editor-component] button:hover:not([class*="ghost"]):not([class*="outline"]),
        div[data-button-id="${data.id}"][data-editor-component] button[class*="outline"]:hover,
        div[data-button-id="${data.id}"][data-editor-component] button[class*="ghost"]:hover,
        div[data-button-id="${data.id}"][data-editor-component] button:hover span,
        div[data-button-id="${data.id}"][data-editor-component] button:hover span span,
        div[data-button-id="${data.id}"][data-editor-component] button:hover *,
        div[data-button-id="${data.id}"][data-editor-component] button[style*="background"]:hover,
        div[data-button-id="${data.id}"][data-editor-component] button[style*="background"]:hover span,
        div[data-button-id="${data.id}"][data-editor-component] button[style*="background"]:hover *,
        [data-button-id="${data.id}"][data-editor-component] button:hover,
        [data-button-id="${data.id}"][data-editor-component] button:hover:not([class*="ghost"]):not([class*="outline"]),
        [data-button-id="${data.id}"][data-editor-component] button[class*="outline"]:hover,
        [data-button-id="${data.id}"][data-editor-component] button[class*="ghost"]:hover,
        [data-button-id="${data.id}"][data-editor-component] button:hover span,
        [data-button-id="${data.id}"][data-editor-component] button:hover span span,
        [data-button-id="${data.id}"][data-editor-component] button:hover * {
          color: ${buttonHoverTextColor} !important;
        }
        
        /* Hover state - background color */
        ${buttonHoverBackgroundColor && buttonHoverBackgroundColor.trim() !== '' ? `
        div[data-button-id="${data.id}"][data-editor-component] button:hover,
        div[data-button-id="${data.id}"][data-editor-component] button:hover:not([class*="ghost"]):not([class*="outline"]),
        [data-button-id="${data.id}"][data-editor-component] button:hover {
          background-color: ${buttonHoverBackgroundColor} !important;
        }
        ` : ''}
      `;
      
      // Override border radius if set
      if (buttonBorderRadius && buttonBorderRadius.trim() !== '') {
        styleContent += `
          [data-button-id="${data.id}"][data-editor-component] button,
          [data-button-id="${data.id}"][data-editor-component] button:not(.rounded-full) {
            border-radius: ${buttonBorderRadius} !important;
          }
        `;
      }
      
      styleEl.textContent = styleContent;
      
      // Ensure style is appended at the end of head to override global styles
      if (!document.getElementById(styleId)) {
        // Append at the end to ensure it overrides other styles
        document.head.appendChild(styleEl);
        // Force it to be last by removing and re-adding
        setTimeout(() => {
          const existing = document.getElementById(styleId);
          if (existing && existing.parentNode) {
            existing.parentNode.removeChild(existing);
            document.head.appendChild(existing);
          }
        }, 0);
      } else {
        const existing = document.getElementById(styleId);
        if (existing) {
          existing.textContent = styleContent;
          // Move to end to ensure it's last
          if (existing.parentNode) {
            existing.parentNode.removeChild(existing);
            document.head.appendChild(existing);
          }
        }
      }
    }
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, [isPreviewMode, buttonTextColor, buttonHoverTextColor, buttonHoverBackgroundColor, buttonBorderRadius, data.id, styleId]);
  
  // Get design palette colors
  const primaryColor = designPalette?.primaryColor || 
    (typeof window !== 'undefined' 
      ? getComputedStyle(document.documentElement).getPropertyValue('--palette-primary').trim() || '#000000'
      : '#000000');
  const backgroundColor = designPalette?.backgroundColor || 
    (typeof window !== 'undefined' 
      ? getComputedStyle(document.documentElement).getPropertyValue('--palette-background').trim() || '#ffffff'
      : '#ffffff');

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

  const handleAlignmentChange = (alignment: 'left' | 'center' | 'right') => {
    onUpdate({ ...data, alignment });
  };

  const handleLayoutChange = (layout: 'horizontal' | 'vertical') => {
    onUpdate({ ...data, layout: layout as any });
  };

  const buttonLayout = (data as any).layout || 'horizontal';

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

  // Edit mode - show editing controls
  if (!isPreviewMode) {
    return (
      <div className="space-y-3">
        {/* Compact Layout & Alignment */}
        <div className="p-3 border border-border rounded-lg bg-muted/20 space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-medium text-foreground">Layout</label>
            <div className="flex items-center gap-2">
              {data.buttons.length === 2 && (
                <>
                  <Button
                    type="button"
                    variant={buttonLayout === 'horizontal' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleLayoutChange('horizontal')}
                    className="h-7 px-2"
                    title="Horizontal"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant={buttonLayout === 'vertical' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleLayoutChange('vertical')}
                    className="h-7 px-2"
                    title="Vertical"
                  >
                    <LayoutList className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-medium text-foreground">Alignment</label>
            <div className="flex gap-1.5">
              <Button
                type="button"
                variant={data.alignment === 'left' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleAlignmentChange('left')}
                className="h-7 px-2.5 text-xs"
              >
                L
              </Button>
              <Button
                type="button"
                variant={data.alignment === 'center' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleAlignmentChange('center')}
                className="h-7 px-2.5 text-xs"
              >
                C
              </Button>
              <Button
                type="button"
                variant={data.alignment === 'right' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleAlignmentChange('right')}
                className="h-7 px-2.5 text-xs"
              >
                R
              </Button>
            </div>
          </div>
        </div>

        {/* Compact Styling - All Buttons */}
        <div className="p-3 border border-border rounded-lg bg-muted/20 space-y-2.5">
          <h4 className="text-xs font-semibold text-foreground">All Buttons Styling</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block text-xs text-muted-foreground">Text</label>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={componentStyles.color || '#ffffff'}
                  onChange={(e) => onUpdate({ ...data, styles: { ...componentStyles, color: e.target.value } })}
                  className="w-7 h-7 rounded border border-border cursor-pointer"
                />
                <Input
                  type="text"
                  value={componentStyles.color || ''}
                  onChange={(e) => onUpdate({ ...data, styles: { ...componentStyles, color: e.target.value } })}
                  placeholder="#fff"
                  className="flex-1 h-7 text-xs font-mono px-2"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs text-muted-foreground">Background</label>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={componentStyles.backgroundColor || primaryColor}
                  onChange={(e) => onUpdate({ ...data, styles: { ...componentStyles, backgroundColor: e.target.value } })}
                  className="w-7 h-7 rounded border border-border cursor-pointer"
                />
                <Input
                  type="text"
                  value={componentStyles.backgroundColor || ''}
                  onChange={(e) => onUpdate({ ...data, styles: { ...componentStyles, backgroundColor: e.target.value } })}
                  placeholder={primaryColor}
                  className="flex-1 h-7 text-xs font-mono px-2"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block text-xs text-muted-foreground">Hover Text</label>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={componentStyles.hoverTextColor || componentStyles.color || '#ffffff'}
                  onChange={(e) => onUpdate({ ...data, styles: { ...componentStyles, hoverTextColor: e.target.value } })}
                  className="w-7 h-7 rounded border border-border cursor-pointer"
                />
                <Input
                  type="text"
                  value={componentStyles.hoverTextColor || ''}
                  onChange={(e) => onUpdate({ ...data, styles: { ...componentStyles, hoverTextColor: e.target.value } })}
                  placeholder="auto"
                  className="flex-1 h-7 text-xs font-mono px-2"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs text-muted-foreground">Hover Bg</label>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={componentStyles.hoverBackgroundColor || componentStyles.backgroundColor || primaryColor}
                  onChange={(e) => onUpdate({ ...data, styles: { ...componentStyles, hoverBackgroundColor: e.target.value } })}
                  className="w-7 h-7 rounded border border-border cursor-pointer"
                />
                <Input
                  type="text"
                  value={componentStyles.hoverBackgroundColor || ''}
                  onChange={(e) => onUpdate({ ...data, styles: { ...componentStyles, hoverBackgroundColor: e.target.value } })}
                  placeholder="auto"
                  className="flex-1 h-7 text-xs font-mono px-2"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <MetricInput
              label="Radius"
              value={componentStyles.borderRadius || ''}
              onChange={(value) => onUpdate({ ...data, styles: { ...componentStyles, borderRadius: value } })}
              placeholder="0.5rem"
            />
            <MetricInput
              label="Padding"
              value={componentStyles.padding || ''}
              onChange={(value) => onUpdate({ ...data, styles: { ...componentStyles, padding: value } })}
              placeholder="16px"
            />
          </div>
        </div>

        {/* Individual Buttons */}
        <div className="space-y-2.5">
          {data.buttons.map((btn, index) => (
            <div key={index} className="p-3 border border-border rounded-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold">Button {index + 1}</h4>
                {data.buttons.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveButton(index)}
                    className="h-6 w-6 p-0 text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs text-muted-foreground">Text</label>
                  <Input
                    type="text"
                    value={btn.text || ''}
                    onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
                    placeholder="Button text"
                    className="w-full h-7 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs text-muted-foreground">Link</label>
                  <Input
                    type="text"
                    value={btn.link || ''}
                    onChange={(e) => handleButtonChange(index, 'link', e.target.value)}
                    placeholder="https://..."
                    className="w-full h-7 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs text-muted-foreground">Variant</label>
                  <select
                    value={btn.variant || 'default'}
                    onChange={(e) => handleButtonChange(index, 'variant', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-border rounded-md bg-background h-7"
                  >
                    <option value="default">Primary</option>
                    <option value="outline">Outline</option>
                    <option value="ghost">Ghost</option>
                    <option value="destructive">Destructive</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={btn.openInNewTab || false}
                      onChange={(e) => handleButtonChange(index, 'openInNewTab', e.target.checked ? 'true' : undefined)}
                      className="h-3.5 w-3.5"
                    />
                    New tab
                  </label>
                </div>
              </div>
              {/* Individual Button Styling */}
              <div className="pt-2 border-t border-border space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Override Styling</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-xs text-muted-foreground">Text</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="color"
                        value={btn.iconColor || (btn.variant === 'default' ? '#ffffff' : primaryColor) || '#000000'}
                        onChange={(e) => handleButtonChange(index, 'iconColor', e.target.value)}
                        className="w-7 h-7 rounded border border-border cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={btn.iconColor || ''}
                        onChange={(e) => handleButtonChange(index, 'iconColor', e.target.value)}
                        placeholder="auto"
                        className="flex-1 h-7 text-xs font-mono px-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs text-muted-foreground">Background</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="color"
                        value={(btn as any).buttonBackgroundColor || (btn.variant === 'default' ? primaryColor : 'transparent') || '#000000'}
                        onChange={(e) => handleButtonChange(index, 'buttonBackgroundColor' as any, e.target.value)}
                        className="w-7 h-7 rounded border border-border cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={(btn as any).buttonBackgroundColor || ''}
                        onChange={(e) => handleButtonChange(index, 'buttonBackgroundColor' as any, e.target.value)}
                        placeholder="auto"
                        className="flex-1 h-7 text-xs font-mono px-2"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MetricInput
                    label="Radius"
                    value={(btn as any).borderRadius || ''}
                    onChange={(value) => handleButtonChange(index, 'borderRadius' as any, value)}
                    placeholder="auto"
                  />
                  <MetricInput
                    label="Padding"
                    value={btn.paddingX || ''}
                    onChange={(value) => handleButtonChange(index, 'paddingX', value)}
                    placeholder="auto"
                  />
                </div>
              </div>
            </div>
          ))}
          {data.buttons.length < 2 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddButton}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Button
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Preview mode - show clean content only
  const layoutClass = buttonLayout === 'vertical' ? 'flex-col' : 'flex-wrap';
  
  return (
    <div className={`flex ${layoutClass} gap-4 ${getAlignmentClass()}`} data-button-id={data.id} data-editor-component>
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

          // Individual button styles override component styles
          // Priority: button-specific > component styles > design palette defaults
          const buttonBackgroundColor = (btn as any).buttonBackgroundColor || 
            componentStyles.backgroundColor ||
            (isPrimary ? primaryColor : undefined);
            
          // Text color priority: componentStyles.color (from edit modal) > iconColor (for backward compat) > default white
          // Always default to white for primary buttons, use componentStyles.color if set
          const buttonTextColor = componentStyles.color ||
            btn.iconColor || 
            (isPrimary ? '#ffffff' : primaryColor);
            
          // Border radius: button-specific > component styles > default
          const buttonBorderRadius = (btn as any).borderRadius || 
            componentStyles.borderRadius || 
            undefined; // Don't set default, let CSS handle it if not specified

          const baseStyle: React.CSSProperties = {
            ...componentStyle,
            width: btn.width || componentStyle.width || undefined,
            height: btn.height || componentStyle.height || undefined,
          };
          
          // Only set border radius if explicitly set
          if (buttonBorderRadius) {
            baseStyle.borderRadius = buttonBorderRadius;
          }
          
          // Always set colors - buttonTextColor defaults to white if not set
          if (buttonBackgroundColor) {
            baseStyle.backgroundColor = buttonBackgroundColor;
          }
          // Always set text color - it will default to white
          baseStyle.color = buttonTextColor;

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
          }
          
          // Text color is already set above in baseStyle.color = buttonTextColor

          const iconColor =
            btn.iconColor ||
            (isPrimary
              ? '#ffffff'
              : componentStyles.color || primaryColor);

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
          // Apply variant-specific defaults if no custom styling
          const finalStyle = { ...baseStyle };
          
          // For outline and ghost variants, ensure proper defaults if no custom colors
          if (btn.variant === 'outline' && !(btn as any).buttonBackgroundColor && !componentStyles.backgroundColor) {
            finalStyle.backgroundColor = 'transparent';
          }
          if (btn.variant === 'ghost' && !(btn as any).buttonBackgroundColor && !componentStyles.backgroundColor) {
            finalStyle.backgroundColor = 'transparent';
          }
          
          return (
            <Button
              key={index}
              variant={btn.variant || 'default'}
              className="transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              style={finalStyle}
              onClick={() => handleButtonClick(btn.link, btn.openInNewTab)}
              data-button-instance={index}
            >
              <span
                className={`inline-flex w-full items-center gap-2 ${getButtonContentClass(btn)}`}
              >
                {iconPlacement !== 'right' && iconElement}
                {shouldShowText && (
                  <span style={{ fontWeight: 600 }}>
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

export default CTAButton