"use client";

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Plus, Palette, Search, Eye, Save, Settings, Monitor, Smartphone, ArrowLeft, X, Copy, GripVertical } from "lucide-react";
import Link from 'next/link';
import { componentRegistry, componentCategories, ComponentType, getComponent, searchComponents } from "@/lib/component-registry";
import { ComponentData, generateComponentId, getDefaultComponentData, DesignPalette, defaultDesignPalette } from "@/lib/editor-state";
import DesignPaletteComponent from "@/components/editor/design-palette";
import ComponentStack from "@/components/editor/component-stack";
import SEOSettingsComponent, { SEOSettings } from "@/components/editor/seo-settings";
import { getTemplateById } from "@/lib/templates";
import { createWebsite, updateWebsite, getWebsiteById, generateSlug, generateUniqueDomain } from "@/lib/supabase/websites";
import { getCurrentUserId } from "@/lib/supabase/auth";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function EditorPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  const websiteId = searchParams.get('id'); // For editing existing website
  
  const [title, setTitle] = React.useState<string>("Untitled");
  const [websiteIdState, setWebsiteIdState] = React.useState<string | null>(websiteId);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isEditingTitle, setIsEditingTitle] = React.useState<boolean>(false);
  const [device, setDevice] = React.useState<"desktop" | "mobile">("desktop");
  const [components, setComponents] = React.useState<ComponentData[]>([]);
  const [isComponentModalOpen, setIsComponentModalOpen] = React.useState(false);
  const [componentInsertIndex, setComponentInsertIndex] = React.useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isPreviewMode, setIsPreviewMode] = React.useState(false);
  const [isDesignPaletteOpen, setIsDesignPaletteOpen] = React.useState(false);
  const [designPalette, setDesignPalette] = React.useState<DesignPalette>(defaultDesignPalette);
  const [isSEOModalOpen, setIsSEOModalOpen] = React.useState(false);
  const [seoSettings, setSeoSettings] = React.useState<SEOSettings>({
    title: "",
    description: "",
    ogImage: "",
    canonicalUrl: "",
  });
  const [selectedComponentIndex, setSelectedComponentIndex] = React.useState<number | undefined>(undefined);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const scrollIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Apply design palette globally
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--palette-primary', designPalette.primaryColor);
    root.style.setProperty('--palette-bg', designPalette.backgroundColor);
    root.style.setProperty('--palette-title', designPalette.titleColor);
    root.style.setProperty('--palette-description', designPalette.descriptionColor);
    root.style.setProperty('--palette-font', designPalette.fontFamily);
    root.style.setProperty('--palette-radius', designPalette.borderRadius);
    
    // Helper functions for color conversion
    const hexToRgbString = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
    };
    
    const hexToRgbObject = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };
    
    // Extract RGB values from primary color for color-mix
    root.style.setProperty('--primary-rgb', hexToRgbString(designPalette.primaryColor));

    // Load Google Font
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${designPalette.fontFamily.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
    link.rel = 'stylesheet';
    if (!document.head.querySelector(`link[href*="${designPalette.fontFamily}"]`)) {
      document.head.appendChild(link);
    }

    // Apply border radius to all elements that need it
    const styleId = 'design-palette-radius';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    
    // Helper function to determine if background is light or dark
    const getLuminance = (hex: string) => {
      const rgb = hexToRgbObject(hex);
      if (!rgb) return 128;
      return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
    };
    
    const bgLuminance = getLuminance(designPalette.backgroundColor);
    const textColor = bgLuminance > 128 ? '#000000' : '#ffffff';
    const primaryTextColor = getLuminance(designPalette.primaryColor) > 128 ? '#000000' : '#ffffff';

    styleEl.textContent = `
      [data-editor-component] img:not(.rounded-full),
      [data-editor-component] .rounded:not(.rounded-full),
      [data-editor-component] .rounded-lg:not(.rounded-full),
      [data-editor-component] .rounded-xl:not(.rounded-full),
      [data-editor-component] .rounded-2xl:not(.rounded-full),
      [data-editor-component] > div:first-child:not([class*="rounded-full"]),
      [data-editor-component] .card:not([class*="rounded-full"]),
      [data-editor-component] [class*="rounded"]:not(.rounded-full),
      [data-editor-component] button:not(.rounded-full),
      [data-editor-component] a:not(.rounded-full) {
        border-radius: var(--palette-radius, ${designPalette.borderRadius}) !important;
      }
      [data-editor-component] .rounded-full,
      [data-editor-component] img.rounded-full {
        border-radius: 9999px !important;
      }
      [data-editor-component] {
        color: ${textColor} !important;
      }
      [data-editor-component] * {
        color: inherit !important;
      }
      [data-editor-component] h1,
      [data-editor-component] h2,
      [data-editor-component] h3,
      [data-editor-component] h4,
      [data-editor-component] h5,
      [data-editor-component] h6 {
        color: var(--palette-title, ${designPalette.titleColor}) !important;
      }
      [data-editor-component] p,
      [data-editor-component] span:not([class*="icon"]):not([class*="badge"]) {
        color: var(--palette-description, ${designPalette.descriptionColor}) !important;
      }
      [data-editor-component] .bg-card,
      [data-editor-component] [class*="bg-card"] {
        background-color: ${designPalette.backgroundColor} !important;
        color: ${textColor} !important;
      }
      [data-editor-component] h1:not(.text-gray-700),
      [data-editor-component] h2:not(.text-gray-700),
      [data-editor-component] h3:not(.text-gray-700),
      [data-editor-component] h4:not(.text-gray-700),
      [data-editor-component] h5:not(.text-gray-700),
      [data-editor-component] h6:not(.text-gray-700) {
        color: var(--palette-title, ${designPalette.titleColor}) !important;
      }
      [data-editor-component] p:not(.text-gray-700),
      [data-editor-component] span:not([style*="color"]):not([class*="icon"]):not(.text-gray-700) {
        color: var(--palette-description, ${designPalette.descriptionColor}) !important;
      }
      [data-editor-component] .text-gray-700,
      [data-editor-component] h2.text-gray-700 {
        color: rgb(55 65 81) !important;
      }
      [data-editor-component] button[style*="background"] {
        color: ${primaryTextColor} !important;
      }
      [data-editor-component] .border-border {
        border-color: ${bgLuminance > 128 ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'} !important;
      }
      ${!isPreviewMode ? `
      [data-editor-component]:not([class*="spacer"]) {
        box-shadow: 0 1px 3px rgba(0,0,0,0.03);
      }
      [data-editor-component] .hover\\:shadow-lg:hover {
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04) !important;
      }
      ` : `
      [data-editor-component],
      [data-editor-component] *,
      [data-editor-component] *:hover,
      [data-editor-component] *[style*="box-shadow"],
      [data-editor-component] *[style*="boxShadow"] {
        box-shadow: none !important;
        border-bottom: none !important;
      }
      [data-editor-component] *[style] {
        box-shadow: none !important;
      }
      `}
      [data-editor-component][class*="spacer"],
      [data-editor-component] .spacer {
        box-shadow: none !important;
      }
      [data-editor-component] input,
      [data-editor-component] textarea {
        background-color: ${bgLuminance > 128 ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.05)'} !important;
        border-color: ${bgLuminance > 128 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'} !important;
      }
      [data-editor-component] input:focus,
      [data-editor-component] textarea:focus {
        border-color: var(--palette-primary) !important;
        box-shadow: 0 0 0 3px ${designPalette.primaryColor}15 !important;
      }
      [data-editor-component] [class*="rounded-full"]:not(img):not(button):not(a),
      [data-editor-component] [class*="pill"],
      [data-editor-component] [class*="badge"],
      [data-editor-component] [style*="border-radius: 9999px"],
      [data-editor-component] [style*="borderRadius: 9999px"] {
        border-color: ${designPalette.primaryColor}25 !important;
        background: ${bgLuminance > 128 
          ? `linear-gradient(135deg, ${designPalette.primaryColor}08, ${designPalette.primaryColor}12)` 
          : `linear-gradient(135deg, ${designPalette.primaryColor}15, ${designPalette.primaryColor}20)`} !important;
        color: ${designPalette.titleColor} !important;
      }
      [data-editor-component] [class*="rounded-full"]:not(img):not(button):not(a):hover {
        border-color: ${designPalette.primaryColor}40 !important;
        background: ${bgLuminance > 128 
          ? `linear-gradient(135deg, ${designPalette.primaryColor}12, ${designPalette.primaryColor}18)` 
          : `linear-gradient(135deg, ${designPalette.primaryColor}20, ${designPalette.primaryColor}28)`} !important;
      }
      [data-editor-component] button:not([class*="ghost"]):not([class*="outline"]) {
        background: ${designPalette.primaryColor} !important;
        color: ${primaryTextColor} !important;
      }
      [data-editor-component] button[class*="outline"] {
        border-color: ${designPalette.primaryColor}40 !important;
        color: ${designPalette.primaryColor} !important;
      }
      [data-editor-component] button[class*="outline"]:hover {
        background: ${designPalette.primaryColor}10 !important;
      }
      [data-editor-component] a[class*="primary"],
      [data-editor-component] [class*="link"] {
        color: ${designPalette.primaryColor} !important;
      }
    `;
  }, [designPalette]);

  // Load template if templateId is provided (only once on mount)
  const [templateLoaded, setTemplateLoaded] = React.useState(false);
  React.useEffect(() => {
    if (templateId && !templateLoaded && components.length === 0) {
      const template = getTemplateById(templateId);
      if (template) {
        // Generate new IDs for all components to avoid conflicts
        const newComponents = template.components.map((comp: ComponentData) => ({
          ...comp,
          id: generateComponentId(),
        }));
        setComponents(newComponents);
        setDesignPalette(template.designPalette);
        setTitle(template.name);
        setTemplateLoaded(true);
      }
    }
  }, [templateId, templateLoaded, components.length]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        alert('Please log in to save your website');
        setIsSaving(false);
        return;
      }

      const slug = generateSlug(title);
      const domain = await generateUniqueDomain(slug, userId);

      if (websiteIdState) {
        // Update existing website
        const updated = await updateWebsite(websiteIdState, {
          name: title,
          components,
          design_palette: designPalette,
          seo_settings: seoSettings,
        });
        if (updated) {
          alert('Website saved successfully!');
        } else {
          alert('Failed to save website');
        }
      } else {
        // Create new website
        const newWebsite = await createWebsite({
          user_id: userId,
          name: title,
          slug,
          domain,
          status: 'draft',
          components,
          design_palette: designPalette,
          seo_settings: seoSettings,
          description: seoSettings.description || '',
        });
        if (newWebsite) {
          setWebsiteIdState(newWebsite.id);
          alert(`Website saved! Your domain: ${newWebsite.domain}`);
        } else {
          alert('Failed to create website');
        }
      }
    } catch (error) {
      console.error('Error saving website:', error);
      alert('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  // Load existing website if editing
  React.useEffect(() => {
    async function loadWebsite() {
      if (websiteId && !templateId && components.length === 0) {
        const website = await getWebsiteById(websiteId);
        if (website) {
          setTitle(website.name);
          setComponents(website.components);
          setDesignPalette(website.design_palette);
          setSeoSettings(website.seo_settings);
          setWebsiteIdState(website.id);
        }
      }
    }
    loadWebsite();
  }, [websiteId, templateId, components.length]);

  const handleAddComponent = (componentType: ComponentType) => {
    const id = generateComponentId();
    const defaultData = getDefaultComponentData(componentType, id);
    if (componentInsertIndex !== undefined) {
      const newComponents = [...components];
      newComponents.splice(componentInsertIndex, 0, defaultData);
      setComponents(newComponents);
      setComponentInsertIndex(undefined);
    } else {
    setComponents([...components, defaultData]);
    }
    setIsComponentModalOpen(false);
    setSearchQuery("");
  };

  const handleDuplicateComponent = (index: number) => {
    const componentToDuplicate = components[index];
    const newComponent = {
      ...componentToDuplicate,
      id: generateComponentId(),
    };
    const newComponents = [...components];
    newComponents.splice(index + 1, 0, newComponent);
    setComponents(newComponents);
  };

  const handleRemoveComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const handleUpdateComponent = (index: number, data: ComponentData) => {
    const newComponents = [...components];
    newComponents[index] = data;
    setComponents(newComponents);
  };

  const handleReorder = (newOrder: ComponentData[]) => {
    setComponents(newOrder);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newComponents = [...components];
    [newComponents[index - 1], newComponents[index]] = [newComponents[index], newComponents[index - 1]];
    setComponents(newComponents);
  };

  const handleMoveDown = (index: number) => {
    if (index === components.length - 1) return;
    const newComponents = [...components];
    [newComponents[index], newComponents[index + 1]] = [newComponents[index + 1], newComponents[index]];
    setComponents(newComponents);
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Auto-scroll when dragging near edges
  React.useEffect(() => {
    if (!isDragging) {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
      return;
    }

    const scrollSpeed = 15;
    const scrollThreshold = 150;

    const handleMouseMove = (e: MouseEvent) => {
      const viewportHeight = window.innerHeight;
      const mouseY = e.clientY;
      const distanceFromTop = mouseY;
      const distanceFromBottom = viewportHeight - mouseY;

      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }

      if (distanceFromTop < scrollThreshold) {
        scrollIntervalRef.current = setInterval(() => {
          window.scrollBy({ top: -scrollSpeed, behavior: 'auto' });
        }, 16);
      } else if (distanceFromBottom < scrollThreshold) {
        scrollIntervalRef.current = setInterval(() => {
          window.scrollBy({ top: scrollSpeed, behavior: 'auto' });
        }, 16);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };
  }, [isDragging]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = components.findIndex((c) => c.id === active.id);
      const newIndex = components.findIndex((c) => c.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(components, oldIndex, newIndex);
        setComponents(newOrder);
      }
    }
  };

  // Disable controls when in preview mode
  if (isPreviewMode && components.length === 0) {
    // Hide empty state in preview
  }

  const filteredComponents = searchQuery 
    ? searchComponents(searchQuery)
    : Object.values(componentRegistry);

  // Group components by their display category
  const groupedByCategory = filteredComponents.reduce((acc, comp) => {
    // Find which category section this component belongs to
    let categoryKey = 'content';
    for (const [key, value] of Object.entries(componentCategories)) {
      if (value.components.includes(comp.id)) {
        categoryKey = key;
        break;
      }
    }
    
    if (!acc[categoryKey]) acc[categoryKey] = [];
    acc[categoryKey].push(comp);
    return acc;
  }, {} as Record<string, typeof filteredComponents>);

  return (
    <TooltipProvider>
      <div className="h-screen overflow-y-auto bg-background">
        {/* Page padding to avoid fixed header overlap */}
        <div className="pt-28"/>

        {/* Header */}
        <div className='fixed z-50 top-4 left-0 right-0 flex gap-2  items-center justify-center px-4'>
            <Button variant="outline" size="lg" className=' w-14' asChild>
            <Link href="/dashboard">
            <ArrowLeft className="size-4" />
            </Link>
            </Button>
          <div className=' border border-border bg-white rounded-full max-w-2xl w-full p-3'>
            <div className="flex items-center justify-between gap-4">
              {/* Title editable */}
              <div className="min-w-0 ">
                {isEditingTitle ? (
                  <Input
                    autoFocus
                    value={title}
                    
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setIsEditingTitle(false)
                      if (e.key === 'Escape') setIsEditingTitle(false)
                    }}
                    className="h-9 border-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                ) : (
                  <button
                    className="text-sm bg-transparent  font-medium hover:underline truncate"
                    onClick={() => setIsEditingTitle(true)}
                    title="Click to rename"
                  >
                    {title}
                  </button>
                )}
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-4">
                {/* Device toggle */}
                <div className="flex items-center gap-1 rounded-full p-1 border border-border">
                  <Button
                    variant={device === 'desktop' ? 'default' : 'ghost'}
                    size="icon"
                    className={cn("h-9 w-9", device === 'desktop' ? '' : '')}
                    onClick={() => setDevice('desktop')}
                    title="Desktop preview"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={device === 'mobile' ? 'default' : 'ghost'}
                    size="icon"
                    className={cn("h-9 w-9", device === 'mobile' ? '' : '')}
                    onClick={() => setDevice('mobile')}
                    title="Mobile preview"
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>

                <Button 
                  onClick={() => {
                    const wasPreview = isPreviewMode;
                    setIsPreviewMode(!isPreviewMode);
                    // Scroll to selected section when exiting preview
                    if (wasPreview && selectedComponentIndex !== undefined) {
                      setTimeout(() => {
                        const componentElement = document.querySelector(`[data-component-id="${components[selectedComponentIndex]?.id}"]`);
                        if (componentElement) {
                          componentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }, 100);
                    }
                  }} 
                  size={"sm"}
                  variant={isPreviewMode ? "default" : "outline"}
                >
                  {isPreviewMode ? 'Edit' : 'Preview'}
                  <Eye className="h-4 w-4 ml-2" /> 
                </Button>
                
                <Button onClick={handleSave} size={"sm"} >
                  Save
                  <Save className="h-4 w-4 ml-2" /> 
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - floating fixed left */}
        {!isPreviewMode && (
        <div className='fixed left-4 top-1/2 bg-white -translate-y-1/2 z-10'>
          <div className='bg-card border border-border rounded-2xl p-2 flex flex-col items-center gap-3 shadow-sm'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-12 w-12"
                  onClick={() => setIsComponentModalOpen(true)}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">Add section</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-12 w-12"
                  onClick={() => setIsDesignPaletteOpen(true)}
                >
                  <Palette className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">Design palette</TooltipContent>
            </Tooltip>

            <ComponentStack
              components={components}
              onReorder={handleReorder}
              onRemove={handleRemoveComponent}
              onDuplicate={handleDuplicateComponent}
              currentIndex={selectedComponentIndex}
              onSelect={setSelectedComponentIndex}
            />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-12 w-12"
                  onClick={() => setIsSEOModalOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">SEO</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" className="h-12 w-12">
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">Settings</TooltipContent>
            </Tooltip>
          </div>
        </div>
        )}

        {/* Editor Area - Premium Layout */}
        <div className="px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="flex justify-center">
                <div
                  className={cn(
                    "bg-gradient-to-br from-background via-background to-muted/10 border border-border/50 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm",
                    device === 'desktop' ? "w-[1024px] max-w-full" : "w-[390px] max-w-full",
                  )}
                >
                  {/* Simulated content frame */}
                  <div className="bg-muted h-10 w-full flex items-center px-3 gap-2 border-b border-border">
                    <div className="size-3 rounded-full bg-red-500" />
                    <div className="size-3 rounded-full bg-yellow-500" />
                    <div className="size-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-xs text-muted-foreground">{device === 'desktop' ? 'Desktop' : 'Mobile'} preview</span>
                  </div>
                  <div 
                    className="space-y-12 text-muted-foreground py-20 min-h-[500px] w-full"
                    style={{
                      fontFamily: `var(--palette-font, ${designPalette.fontFamily}), sans-serif`,
                      backgroundColor: designPalette.backgroundColor,
                      borderRadius: designPalette.borderRadius,
                    }}
                  >
                    <SortableContext
                      items={components.map((c) => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="max-w-4xl mx-auto px-8 space-y-6">
                  {components.length === 0 && !isPreviewMode ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                      <Plus className="size-12 text-muted-foreground/50" />
                      <p className="text-muted-foreground">Click the + button to add your first component</p>
                    </div>
                  ) : components.length > 0 ? (
                    components.map((componentData, index) => {
                      const Component = getComponent(componentData.type);
                      const metadata = componentRegistry[componentData.type];
                      
                      // Check if component accepts data prop (editable components)
                      const isEditable = [
                        'header', 'text', 'button', 'image', 'video', 'profile',
                        'gallery', 'skills', 'experience', 'services', 'pricing', 'spacer',
                        'award', 'review', 'contact-form', 'contact-details', 'languages', 'github', 'spotify', 
                        'link-block', 'projects', 'profile-photo', 'tools', 'social-media'
                      ].includes(componentData.type);
                      
                      const EditableComponent = Component as React.ComponentType<{
                        data: ComponentData;
                        isPreviewMode: boolean;
                        onUpdate: (data: ComponentData) => void;
                      }>;
                      
                      return (
                        <ComponentWrapper
                          key={componentData.id}
                          componentId={componentData.id}
                          canMoveUp={index > 0}
                          canMoveDown={index < components.length - 1}
                          onMoveUp={() => handleMoveUp(index)}
                          onMoveDown={() => handleMoveDown(index)}
                          onRemove={() => handleRemoveComponent(index)}
                          onDuplicate={() => handleDuplicateComponent(index)}
                          onAddBelow={() => {
                            setComponentInsertIndex(index + 1);
                            setIsComponentModalOpen(true);
                          }}
                          onSelect={() => setSelectedComponentIndex(index)}
                          componentName={metadata.name}
                          isPreviewMode={isPreviewMode}
                          isSelected={selectedComponentIndex === index}
                          borderRadius={designPalette.borderRadius}
                        >
                          <div data-editor-component data-component-id={componentData.id}>
                            {isEditable ? (
                              <EditableComponent 
                                data={componentData} 
                                isPreviewMode={isPreviewMode}
                                onUpdate={(data: ComponentData) => handleUpdateComponent(index, data)}
                              />
                            ) : (
                              <Component />
                            )}
                          </div>
                        </ComponentWrapper>
                      );
                    })
                  ) : null}
                      </div>
                    </SortableContext>
                  </div>
                </div>
              </div>
              <DragOverlay>
                {activeId ? (
                  <div className="opacity-80 rotate-1 scale-105 bg-background border border-border rounded-xl p-4 shadow-2xl">
                    <div className="text-sm font-medium text-foreground">
                      {(() => {
                        const activeComponent = components.find(c => c.id === activeId);
                        if (!activeComponent || !activeComponent.type) return 'Section';
                        const metadata = componentRegistry[activeComponent.type];
                        return metadata?.name || 'Section';
                      })()}
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      </div>

      {/* Design Palette Modal */}
      <DesignPaletteComponent
        open={isDesignPaletteOpen}
        onOpenChange={setIsDesignPaletteOpen}
        palette={designPalette}
        onUpdate={setDesignPalette}
      />

      {/* SEO Settings Modal */}
      <SEOSettingsComponent
        open={isSEOModalOpen}
        onOpenChange={setIsSEOModalOpen}
        seo={seoSettings}
        onUpdate={setSeoSettings}
      />

      {/* Component Selection Modal */}
      <Dialog open={isComponentModalOpen} onOpenChange={(open) => {
        setIsComponentModalOpen(open);
        if (!open) setComponentInsertIndex(undefined);
      }}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Component</DialogTitle>
          </DialogHeader>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>

          {/* Component List - Grouped by Category */}
          <div className="flex-1 overflow-y-auto space-y-6">
            {Object.entries(componentCategories).map(([categoryKey, categoryInfo]) => {
              const categoryComponents = groupedByCategory[categoryKey] || [];
              
              // Skip empty categories
              if (categoryComponents.length === 0) return null;

              return (
                <div key={categoryKey} className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                    {categoryInfo.name}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {categoryComponents.map((component) => (
                      <button
                        key={component.id}
                        onClick={() => handleAddComponent(component.id)}
                        className="text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors group"
                      >
                        <div className="font-medium text-sm group-hover:text-primary">
                          {component.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {component.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}

// Component Wrapper with Controls - Premium Design with Drag
function ComponentWrapper({
  children,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onRemove,
  onDuplicate,
  onAddBelow,
  onSelect,
  componentName,
  isPreviewMode,
  isSelected,
  borderRadius,
  componentId,
}: {
  children: React.ReactNode;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onAddBelow: () => void;
  onSelect?: () => void;
  componentName: string;
  isPreviewMode: boolean;
  isSelected?: boolean;
  borderRadius: string;
  componentId: string;
}) {
  const [isHovered, setIsHovered] = React.useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: componentId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (isPreviewMode) {
    return (
      <div className="w-full [&>*]:border-none [&>*]:shadow-none [&>*]:border-b-0 [&_*]:shadow-none [&_*]:border-b-0">
        {children}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group rounded-xl transition-all duration-200",
        isSelected 
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
          : "ring-1 ring-transparent hover:ring-border",
        isHovered && "bg-muted/20",
        isDragging && "z-50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left Side Controls - Drag, Duplicate, Delete */}
      <div
        className={cn(
          "absolute -left-14 top-0 flex flex-col items-center gap-1.5 transition-opacity z-30",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Drag Handle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 bg-background shadow-sm hover:bg-muted cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Drag to reorder</TooltipContent>
        </Tooltip>

        {/* Duplicate */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 bg-background shadow-sm hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Duplicate</TooltipContent>
        </Tooltip>

        {/* Remove */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 bg-background shadow-sm hover:bg-destructive hover:text-destructive-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Remove</TooltipContent>
        </Tooltip>
      </div>

      {/* Top Bar - Component Name */}
      {isHovered && (
        <div className="absolute -top-7 left-0 z-20">
          <div className="px-2 py-1 rounded-md bg-foreground text-background text-xs font-medium shadow-sm">
            {componentName}
          </div>
        </div>
      )}

      {/* Add Component Button - Center Bottom */}
      {isHovered && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-20">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="default"
                className="h-9 w-9 rounded-full shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddBelow();
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add section below</TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Component Content */}
      <div className="w-full relative" onClick={onSelect}>
        {children}
      </div>
    </div>
  );
}