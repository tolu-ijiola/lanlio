import React, { useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Plus, X, Briefcase, Upload, Search } from "lucide-react";
import { ComponentData } from "@/lib/editor-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
// React Icons - Multiple icon libraries
import { 
  FaBriefcase, FaAward, FaRocket, FaCode, FaStar, FaHeart, FaCheckCircle, FaBuilding,
  FaPalette, FaWrench, FaLightbulb, FaBullseye, FaSparkles, FaCircle,
} from "react-icons/fa";
import { 
  MdWork, MdEmojiEvents, MdRocketLaunch, MdCode, MdStar, MdFavorite, MdCheckCircle,
  MdBusiness, MdPalette, MdBuild, MdLightbulb, MdTarget, MdAutoAwesome, MdCircle,
} from "react-icons/md";
import { 
  FiBriefcase, FiAward, FiRocket, FiCode, FiStar, FiHeart, FiCheckCircle, FiBuilding,
  FiPalette, FiTool, FiZap, FiTarget, FiCircle,
} from "react-icons/fi";
import { 
  HiBriefcase, HiTrophy, HiRocketLaunch, HiCodeBracket, HiStar, HiHeart, HiCheckCircle,
  HiBuildingOffice, HiPaintBrush, HiWrenchScrewdriver, HiLightBulb, HiTarget,
} from "react-icons/hi2";
import { 
  SiJavascript, SiPython, SiReact, SiNodedotjs, SiHtml5, SiCss3, SiGit,
} from "react-icons/si";

// Comprehensive icon map with multiple libraries
const iconMap: Record<string, { component: React.ComponentType<{ className?: string; style?: React.CSSProperties }>, name: string, library: string }> = {
  // Font Awesome
  'fa-briefcase': { component: FaBriefcase, name: 'Briefcase', library: 'Font Awesome' },
  'fa-award': { component: FaAward, name: 'Award', library: 'Font Awesome' },
  'fa-rocket': { component: FaRocket, name: 'Rocket', library: 'Font Awesome' },
  'fa-code': { component: FaCode, name: 'Code', library: 'Font Awesome' },
  'fa-star': { component: FaStar, name: 'Star', library: 'Font Awesome' },
  'fa-heart': { component: FaHeart, name: 'Heart', library: 'Font Awesome' },
  'fa-check-circle': { component: FaCheckCircle, name: 'Check Circle', library: 'Font Awesome' },
  'fa-building': { component: FaBuilding, name: 'Building', library: 'Font Awesome' },
  'fa-palette': { component: FaPalette, name: 'Palette', library: 'Font Awesome' },
  'fa-wrench': { component: FaWrench, name: 'Wrench', library: 'Font Awesome' },
  'fa-lightbulb': { component: FaLightbulb, name: 'Lightbulb', library: 'Font Awesome' },
  'fa-bullseye': { component: FaBullseye, name: 'Target', library: 'Font Awesome' },
  'fa-sparkles': { component: FaSparkles, name: 'Sparkles', library: 'Font Awesome' },
  'fa-circle': { component: FaCircle, name: 'Circle', library: 'Font Awesome' },
  
  // Material Design
  'md-work': { component: MdWork, name: 'Work', library: 'Material Design' },
  'md-emoji-events': { component: MdEmojiEvents, name: 'Award', library: 'Material Design' },
  'md-rocket-launch': { component: MdRocketLaunch, name: 'Rocket', library: 'Material Design' },
  'md-code': { component: MdCode, name: 'Code', library: 'Material Design' },
  'md-star': { component: MdStar, name: 'Star', library: 'Material Design' },
  'md-favorite': { component: MdFavorite, name: 'Favorite', library: 'Material Design' },
  'md-check-circle': { component: MdCheckCircle, name: 'Check Circle', library: 'Material Design' },
  'md-business': { component: MdBusiness, name: 'Business', library: 'Material Design' },
  'md-palette': { component: MdPalette, name: 'Palette', library: 'Material Design' },
  'md-build': { component: MdBuild, name: 'Build', library: 'Material Design' },
  'md-lightbulb': { component: MdLightbulb, name: 'Lightbulb', library: 'Material Design' },
  'md-target': { component: MdTarget, name: 'Target', library: 'Material Design' },
  'md-auto-awesome': { component: MdAutoAwesome, name: 'Auto Awesome', library: 'Material Design' },
  'md-circle': { component: MdCircle, name: 'Circle', library: 'Material Design' },
  
  // Feather
  'fi-briefcase': { component: FiBriefcase, name: 'Briefcase', library: 'Feather' },
  'fi-award': { component: FiAward, name: 'Award', library: 'Feather' },
  'fi-rocket': { component: FiRocket, name: 'Rocket', library: 'Feather' },
  'fi-code': { component: FiCode, name: 'Code', library: 'Feather' },
  'fi-star': { component: FiStar, name: 'Star', library: 'Feather' },
  'fi-heart': { component: FiHeart, name: 'Heart', library: 'Feather' },
  'fi-check-circle': { component: FiCheckCircle, name: 'Check Circle', library: 'Feather' },
  'fi-building': { component: FiBuilding, name: 'Building', library: 'Feather' },
  'fi-palette': { component: FiPalette, name: 'Palette', library: 'Feather' },
  'fi-tool': { component: FiTool, name: 'Tool', library: 'Feather' },
  'fi-zap': { component: FiZap, name: 'Zap', library: 'Feather' },
  'fi-target': { component: FiTarget, name: 'Target', library: 'Feather' },
  'fi-circle': { component: FiCircle, name: 'Circle', library: 'Feather' },
  
  // Heroicons
  'hi-briefcase': { component: HiBriefcase, name: 'Briefcase', library: 'Heroicons' },
  'hi-trophy': { component: HiTrophy, name: 'Trophy', library: 'Heroicons' },
  'hi-rocket-launch': { component: HiRocketLaunch, name: 'Rocket Launch', library: 'Heroicons' },
  'hi-code-bracket': { component: HiCodeBracket, name: 'Code Bracket', library: 'Heroicons' },
  'hi-star': { component: HiStar, name: 'Star', library: 'Heroicons' },
  'hi-heart': { component: HiHeart, name: 'Heart', library: 'Heroicons' },
  'hi-check-circle': { component: HiCheckCircle, name: 'Check Circle', library: 'Heroicons' },
  'hi-building-office': { component: HiBuildingOffice, name: 'Building Office', library: 'Heroicons' },
  'hi-paint-brush': { component: HiPaintBrush, name: 'Paint Brush', library: 'Heroicons' },
  'hi-wrench-screwdriver': { component: HiWrenchScrewdriver, name: 'Wrench', library: 'Heroicons' },
  'hi-light-bulb': { component: HiLightBulb, name: 'Light Bulb', library: 'Heroicons' },
  'hi-target': { component: HiTarget, name: 'Target', library: 'Heroicons' },
  
  // Simple Icons (Tech)
  'si-javascript': { component: SiJavascript, name: 'JavaScript', library: 'Simple Icons' },
  'si-python': { component: SiPython, name: 'Python', library: 'Simple Icons' },
  'si-react': { component: SiReact, name: 'React', library: 'Simple Icons' },
  'si-nodejs': { component: SiNodedotjs, name: 'Node.js', library: 'Simple Icons' },
  'si-html5': { component: SiHtml5, name: 'HTML5', library: 'Simple Icons' },
  'si-css3': { component: SiCss3, name: 'CSS3', library: 'Simple Icons' },
  'si-git': { component: SiGit, name: 'Git', library: 'Simple Icons' },
};

interface Service {
  title: string;
  description: string;
  icon?: string; // Format: "library:iconName" or "custom:base64svg" or "custom:url"
  iconColor?: string;
  iconBackgroundColor?: string;
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
    icon: 'fa-briefcase',
    iconColor: '#ffffff',
    iconBackgroundColor: '',
  });
  const [iconSearch, setIconSearch] = React.useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddService = () => {
    if (newService.title.trim() && newService.description.trim()) {
      onUpdate({
        ...data,
        services: [...data.services, { ...newService }],
      });
      setNewService({ 
        title: '', 
        description: '', 
        icon: 'fa-briefcase',
        iconColor: '#ffffff',
        iconBackgroundColor: '',
      });
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

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>, serviceIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/svg+xml') {
      alert('Please upload an SVG file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const svgContent = event.target?.result as string;
      const base64 = btoa(svgContent);
      
      if (serviceIndex !== undefined) {
        // Update existing service
        handleUpdateService(serviceIndex, 'icon', `custom:${base64}`);
      } else {
        // Update new service
        setNewService({ ...newService, icon: `custom:${base64}` });
      }
    };
    reader.readAsText(file);
  };

  const renderIcon = (iconString: string | undefined, iconColor: string = '#ffffff', iconBgColor: string = '') => {
    if (!iconString) {
      const DefaultIcon = iconMap['fa-briefcase'].component;
      return <DefaultIcon className="size-6" style={{ color: iconColor }} />;
    }

    if (iconString.startsWith('custom:')) {
      // Custom SVG icon
      const svgBase64 = iconString.replace('custom:', '');
      try {
        const svgContent = atob(svgBase64);
        return (
          <div 
            className="size-6"
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{ color: iconColor }}
          />
        );
      } catch (e) {
        return <Briefcase className="size-6" style={{ color: iconColor }} />;
      }
    }

    // Library icon
    const iconInfo = iconMap[iconString];
    if (!iconInfo) {
      const DefaultIcon = iconMap['fa-briefcase'].component;
      return <DefaultIcon className="size-6" style={{ color: iconColor }} />;
    }

    const IconComponent = iconInfo.component;
    return <IconComponent className="size-6" style={{ color: iconColor }} />;
  };

  // Preview mode - show only the preview
  if (isPreviewMode) {
    const styles = (data as any).styles || {};
    const gap = (data as any).gap || '24px';
    const titleColor = styles.color || 'var(--palette-title)';
    const descriptionColor = styles.descriptionColor || 'var(--palette-description)';
    const customStyles = {
      itemBackgroundColor: (data as any).itemBackgroundColor || '',
      itemBorderColor: (data as any).itemBorderColor || '',
      itemBorderWidth: (data as any).itemBorderWidth || '',
    };
    
    if (data.services.length === 0) {
      return (
        <div className="max-w-5xl mx-auto">
          <div className="p-6 rounded-lg border border-dashed border-border/50 opacity-50 text-center">
            <Briefcase className="size-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Add your services</p>
          </div>
        </div>
      );
    }

    const renderServiceItem = (service: Service, index: number) => {
      const iconColor = service.iconColor || '#ffffff';
      const iconBgColor = service.iconBackgroundColor || 'var(--palette-primary)';
      
      const itemBackgroundColor = customStyles.itemBackgroundColor || styles.backgroundColor || '#ffffff';
      const itemBorderColor = customStyles.itemBorderColor || styles.borderColor || '#e5e7eb';
      const itemBorderWidth = customStyles.itemBorderWidth || styles.borderWidth || '1px';
      const borderRadius = styles.borderRadius || '12px';
      const padding = styles.padding || '24px';
      const boxShadow = styles.boxShadow;

      return (
        <div 
          key={index} 
          className="hover:shadow-lg transition-all duration-300 group space-y-4"
          style={{ 
            borderRadius: borderRadius,
            backgroundColor: itemBackgroundColor,
            borderColor: itemBorderColor,
            borderWidth: itemBorderWidth,
            borderStyle: 'solid',
            padding: padding,
            boxShadow: boxShadow,
          }}
        >
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: iconBgColor,
              borderRadius: borderRadius,
            }}
          >
            {renderIcon(service.icon, iconColor, iconBgColor)}
          </div>
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
      );
    };
    
    // Calculate grid columns based on service count
    const getGridCols = () => {
      const count = data.services.length;
      if (count === 1) return 'grid-cols-1';
      if (count === 2) return 'grid-cols-1 md:grid-cols-2';
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    };
    
    return (
      <div className={`grid ${getGridCols()} max-w-5xl mx-auto`} style={{ gap }}>
        {data.services.map((service, index) => renderServiceItem(service, index))}
      </div>
    );
  }

  // Edit mode - show controls and preview
  const styles = (data as any).styles || {};
  const gap = (data as any).gap || '24px';
  const titleColor = styles.color || 'var(--palette-title)';
  const descriptionColor = styles.descriptionColor || 'var(--palette-description)';
  const customStyles = {
    itemBackgroundColor: (data as any).itemBackgroundColor || '',
    itemBorderColor: (data as any).itemBorderColor || '',
    itemBorderWidth: (data as any).itemBorderWidth || '',
  };

  const renderServiceItem = (service: Service, index: number) => {
    const iconColor = service.iconColor || '#ffffff';
    const iconBgColor = service.iconBackgroundColor || 'var(--palette-primary)';
    
    const itemBackgroundColor = customStyles.itemBackgroundColor || styles.backgroundColor || '#ffffff';
    const itemBorderColor = customStyles.itemBorderColor || styles.borderColor || '#e5e7eb';
    const itemBorderWidth = customStyles.itemBorderWidth || styles.borderWidth || '1px';
    const borderRadius = styles.borderRadius || '12px';
    const padding = styles.padding || '24px';
    const boxShadow = styles.boxShadow;

    return (
      <div 
        key={index} 
        className="hover:shadow-lg transition-all duration-300 group space-y-4"
        style={{ 
          borderRadius: borderRadius,
          backgroundColor: itemBackgroundColor,
          borderColor: itemBorderColor,
          borderWidth: itemBorderWidth,
          borderStyle: 'solid',
          padding: padding,
          boxShadow: boxShadow,
        }}
      >
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{
            backgroundColor: iconBgColor,
            borderRadius: borderRadius,
          }}
        >
          {renderIcon(service.icon, iconColor, iconBgColor)}
        </div>
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
    );
  };

  // Calculate grid columns based on service count
  const getGridCols = () => {
    const count = data.services.length;
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  // Filter icons based on search
  const filteredIcons = Object.entries(iconMap).filter(([key, info]) => 
    info.name.toLowerCase().includes(iconSearch.toLowerCase()) ||
    info.library.toLowerCase().includes(iconSearch.toLowerCase()) ||
    key.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Add Service Form */}
      <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/20">
        <Label className="text-xs text-muted-foreground">Add Service</Label>
        <Input
          type="text"
          value={newService.title}
          onChange={(e) => setNewService({ ...newService, title: e.target.value })}
          placeholder="Service Title"
          className="h-9 text-xs"
        />
        <Textarea
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
          placeholder="Service Description"
          className="min-h-[80px] text-xs"
        />
        
        {/* Icon Selector for New Service */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Icon</Label>
          <div className="flex gap-2">
            <Select
              value={newService.icon || 'fa-briefcase'}
              onValueChange={(value) => setNewService({ ...newService, icon: value })}
            >
              <SelectTrigger className="h-9 text-xs flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <div className="p-2 border-b border-border sticky top-0 bg-background z-10">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search icons..."
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      className="h-8 pl-7 text-xs"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="max-h-[250px] overflow-y-auto">
                  {filteredIcons.map(([key, info]) => {
                    const IconComponent = info.component;
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-3.5 w-3.5" />
                          <span className="text-xs">{info.name}</span>
                          <span className="text-xs text-muted-foreground ml-auto">({info.library})</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </div>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-9 px-3"
            >
              <Upload className="h-3.5 w-3.5" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/svg+xml"
              onChange={handleIconUpload}
              className="hidden"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Icon Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newService.iconColor || '#ffffff'}
                  onChange={(e) => setNewService({ ...newService, iconColor: e.target.value })}
                  className="w-10 h-9 rounded border border-border cursor-pointer"
                />
                <Input
                  type="text"
                  value={newService.iconColor || ''}
                  onChange={(e) => setNewService({ ...newService, iconColor: e.target.value })}
                  placeholder="#ffffff"
                  className="flex-1 h-9 text-xs font-mono"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Icon Background</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newService.iconBackgroundColor || '#000000'}
                  onChange={(e) => setNewService({ ...newService, iconBackgroundColor: e.target.value })}
                  className="w-10 h-9 rounded border border-border cursor-pointer"
                />
                <Input
                  type="text"
                  value={newService.iconBackgroundColor || ''}
                  onChange={(e) => setNewService({ ...newService, iconBackgroundColor: e.target.value })}
                  placeholder="var(--palette-primary)"
                  className="flex-1 h-9 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAddService}
          disabled={!newService.title.trim() || !newService.description.trim()}
          className="h-9 w-full"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Service
        </Button>
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

      {/* Services List with Individual Icon Editing */}
      {data.services.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Services ({data.services.length})</Label>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {data.services.map((service, index) => (
              <div
                key={index}
                className="p-3 rounded-md border border-border bg-background space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{service.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{service.description}</div>
                  </div>
                  <button
                    onClick={() => handleRemoveService(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
                
                {/* Individual Icon Selector */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Label className="text-xs text-muted-foreground">Icon</Label>
                  <div className="flex gap-2">
                    <Select
                      value={service.icon || 'fa-briefcase'}
                      onValueChange={(value) => handleUpdateService(index, 'icon', value)}
                    >
                      <SelectTrigger className="h-9 text-xs flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <div className="p-2 border-b border-border sticky top-0 bg-background z-10">
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                            <Input
                              type="text"
                              placeholder="Search icons..."
                              value={iconSearch}
                              onChange={(e) => setIconSearch(e.target.value)}
                              className="h-8 pl-7 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div className="max-h-[250px] overflow-y-auto">
                          {filteredIcons.map(([key, info]) => {
                            const IconComponent = info.component;
                            return (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  <IconComponent className="h-3.5 w-3.5" />
                                  <span className="text-xs">{info.name}</span>
                                  <span className="text-xs text-muted-foreground ml-auto">({info.library})</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </div>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/svg+xml';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const svgContent = event.target?.result as string;
                              const base64 = btoa(svgContent);
                              handleUpdateService(index, 'icon', `custom:${base64}`);
                            };
                            reader.readAsText(file);
                          }
                        };
                        input.click();
                      }}
                      className="h-9 px-3"
                    >
                      <Upload className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Icon Color</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={service.iconColor || '#ffffff'}
                          onChange={(e) => handleUpdateService(index, 'iconColor', e.target.value)}
                          className="w-10 h-9 rounded border border-border cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={service.iconColor || ''}
                          onChange={(e) => handleUpdateService(index, 'iconColor', e.target.value)}
                          placeholder="#ffffff"
                          className="flex-1 h-9 text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Icon Background</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={service.iconBackgroundColor || '#000000'}
                          onChange={(e) => handleUpdateService(index, 'iconBackgroundColor', e.target.value)}
                          className="w-10 h-9 rounded border border-border cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={service.iconBackgroundColor || ''}
                          onChange={(e) => handleUpdateService(index, 'iconBackgroundColor', e.target.value)}
                          placeholder="var(--palette-primary)"
                          className="flex-1 h-9 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="pt-3 border-t border-border">
        <Label className="text-xs text-muted-foreground mb-2 block">Preview</Label>
        <div className="max-w-5xl mx-auto">
          {data.services.length === 0 ? (
            <div className="p-6 rounded-lg border border-dashed border-border/50 opacity-50 text-center">
              <Briefcase className="size-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Add your services</p>
            </div>
          ) : (
            <div className={`grid ${getGridCols()}`} style={{ gap }}>
              {data.services.slice(0, 6).map((service, index) => renderServiceItem(service, index))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Services;
