"use client";

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MetricInput } from "@/components/ui/metric-input";
import { AlignmentControl } from "@/components/ui/alignment-control";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Plus, Palette, Search, Eye, Save, Settings, Monitor, Smartphone, ArrowLeft, X, Copy, GripVertical, Edit2, Type, AlignLeft, AlignCenter, AlignRight, Image as ImageIcon, Upload, FileImage, ExternalLink, Loader2 } from "lucide-react";
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
  const params = useParams();
  const router = useRouter();
  const websiteId = params.id as string;
  const isNewWebsite = websiteId === 'new';
  
  const [title, setTitle] = React.useState<string>("Untitled");
  const [websiteIdState, setWebsiteIdState] = React.useState<string | null>(isNewWebsite ? null : websiteId);
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
  const [editingComponentIndex, setEditingComponentIndex] = React.useState<number | undefined>(undefined);
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
  }, [designPalette]);

  // Load template if templateId is provided
  const templateId = React.useMemo(() => {
    // Check URL params for template
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('template');
    }
    return null;
  }, []);

  const [templateLoaded, setTemplateLoaded] = React.useState(false);

  React.useEffect(() => {
    async function loadTemplate() {
      if (templateId && !templateLoaded && components.length === 0) {
        const template = await getTemplateById(templateId);
        if (template) {
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
    }
    loadTemplate();
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

      // Validate title
      const websiteName = title.trim() || 'Untitled Website';
      if (!websiteName || websiteName.length === 0) {
        alert('Please enter a website name');
        setIsSaving(false);
        return;
      }

      const slug = generateSlug(websiteName);
      if (!slug || slug.length === 0) {
        alert('Please enter a valid website name');
        setIsSaving(false);
        return;
      }

      if (websiteIdState) {
        // Update existing website
        const updated = await updateWebsite(websiteIdState, {
          title: websiteName,
          components,
          design_palette: designPalette,
          seo_settings: seoSettings,
        });
        if (updated) {
          alert('Website saved successfully!');
        } else {
          alert('Failed to save website. Please check the console for details.');
        }
      } else {
        // Create new website
        const domain = await generateUniqueDomain(slug, userId);
        const newWebsite = await createWebsite({
          user_id: userId,
          title: websiteName,
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
          // Redirect to the new editor URL with ID
          router.push(`/editor/${newWebsite.id}`);
          alert(`Website saved! Your domain: ${newWebsite.domain}`);
        } else {
          alert('Failed to create website. Please check the console for details.');
        }
      }
    } catch (error) {
      console.error('Error saving website:', error);
      alert(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndOpen = async () => {
    setIsSaving(true);
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        alert('Please log in to save your website');
        setIsSaving(false);
        return;
      }

      // Validate title
      const websiteName = title.trim() || 'Untitled Website';
      if (!websiteName || websiteName.length === 0) {
        alert('Please enter a website name');
        setIsSaving(false);
        return;
      }

      const slug = generateSlug(websiteName);
      if (!slug || slug.length === 0) {
        alert('Please enter a valid website name');
        setIsSaving(false);
        return;
      }

      let domain = '';
      let finalWebsiteId = websiteIdState;

      if (websiteIdState) {
        // Update existing website
        const updated = await updateWebsite(websiteIdState, {
          title: websiteName,
          components,
          design_palette: designPalette,
          seo_settings: seoSettings,
          status: 'published', // Publish when opening
        });
        if (updated) {
          domain = updated.domain;
        } else {
          alert('Failed to save website. Please try again.');
          setIsSaving(false);
          return;
        }
      } else {
        // Create new website
        try {
          domain = await generateUniqueDomain(slug, userId);
          const newWebsite = await createWebsite({
            user_id: userId,
            title: websiteName,
            slug,
            domain,
            status: 'published', // Publish when opening
            components,
            design_palette: designPalette,
            seo_settings: seoSettings,
            description: seoSettings.description || '',
          });
          if (newWebsite) {
            finalWebsiteId = newWebsite.id;
            setWebsiteIdState(newWebsite.id);
            // Redirect to the new editor URL with ID
            router.push(`/editor/${newWebsite.id}`);
          } else {
            alert('Failed to create website. Please check the console for details.');
            setIsSaving(false);
            return;
          }
        } catch (createError) {
          console.error('Error creating website:', createError);
          alert(`Failed to create website: ${createError instanceof Error ? createError.message : 'Unknown error'}`);
          setIsSaving(false);
          return;
        }
      }

      // Open website in new tab using ID
      const websiteUrl = `${window.location.origin}/preview/${finalWebsiteId}`;
      window.open(websiteUrl, '_blank');
    } catch (error) {
      console.error('Error saving and opening website:', error);
      alert(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Load existing website if editing
  React.useEffect(() => {
    async function loadWebsite() {
      if (websiteId && !isNewWebsite && !templateId && components.length === 0) {
        const website = await getWebsiteById(websiteId);
        if (website) {
          setTitle(website.title);
          setComponents(website.components);
          setDesignPalette(website.design_palette);
          setSeoSettings(website.seo_settings);
          setWebsiteIdState(website.id);
        }
      }
    }
    loadWebsite();
  }, [websiteId, isNewWebsite, templateId, components.length]);

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

  const filteredComponents = (searchQuery 
    ? searchComponents(searchQuery)
    : Object.values(componentRegistry)
  ).filter(comp => comp.id !== 'html'); // Remove HTML Code component since it's in embed

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
        {/* Preview Mode Bar */}
        {isPreviewMode && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
            <div className="max-w-full mx-auto px-6 h-9 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-medium text-muted-foreground">Preview</span>
                </div>
              </div>
              <Button
                onClick={() => {
                  setIsPreviewMode(false);
                  // Scroll to selected section when exiting preview
                  if (selectedComponentIndex !== undefined) {
                    setTimeout(() => {
                      const componentElement = document.querySelector(`[data-component-id="${components[selectedComponentIndex]?.id}"]`);
                      if (componentElement) {
                        componentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }, 100);
                  }
                }}
                variant="ghost"
                size="sm"
                className="h-7 px-2.5 text-xs font-medium hover:bg-muted/80"
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                Exit
              </Button>
            </div>
          </div>
        )}

        {/* Page padding to avoid fixed header overlap */}
        <div className={isPreviewMode ? "pt-9" : "pt-28"}/>

        {/* Header */}
        {!isPreviewMode && (
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
                  size="icon"
                  variant={isPreviewMode ? "default" : "outline"}
                  className="h-10 w-10"
                  title={isPreviewMode ? 'Edit' : 'Preview'}
                >
                  <Eye className="h-4 w-4" /> 
                </Button>

                <Button 
                  onClick={handleSaveAndOpen}
                  size="icon"
                  variant="outline"
                  className="h-10 w-10"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-4 w-4" /> 
                </Button>
                
                <Button onClick={handleSave} size={"sm"} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save
                      <Save className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        )}

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
        <div className={cn("pb-20", isPreviewMode ? "px-0" : "px-4")}>
          <div className={cn("mx-auto", isPreviewMode ? "max-w-full" : "max-w-6xl")}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className={cn("flex justify-center", isPreviewMode ? "w-full" : "")}>
                <div
                  className={cn(
                    isPreviewMode 
                      ? "w-full min-h-screen border-0 rounded-none shadow-none" 
                      : "bg-linear-to-br from-background via-background to-muted/10 border border-border/50 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm",
                    !isPreviewMode && (device === 'desktop' ? "w-[1024px] max-w-full" : "w-[390px] max-w-full"),
                  )}
                >
                  {/* Simulated content frame - only show when not in preview mode */}
                  {!isPreviewMode && (
                    <div className="bg-muted h-10 w-full flex items-center px-3 gap-2 border-b border-border">
                      <div className="size-3 rounded-full bg-red-500" />
                      <div className="size-3 rounded-full bg-yellow-500" />
                      <div className="size-3 rounded-full bg-primary" />
                      <span className="ml-2 text-xs text-muted-foreground">{device === 'desktop' ? 'Desktop' : 'Mobile'} preview</span>
                    </div>
                  )}
                  <div 
                    className={cn(
                      "space-y-12 text-muted-foreground py-8 w-full",
                      isPreviewMode ? "min-h-screen max-w-5xl mx-auto" : "min-h-[500px]"
                    )}
                    style={{
                      fontFamily: `var(--palette-font, ${designPalette.fontFamily}), sans-serif`,
                      backgroundColor: designPalette.backgroundColor,
                      borderRadius: isPreviewMode ? '0' : designPalette.borderRadius,
                    }}
                  >
                    <SortableContext
                      items={components.map((c) => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className={cn("mx-auto px-8 space-y-6", isPreviewMode ? "max-w-5xl" : "max-w-4xl")}>
                  {components.length === 0 && !isPreviewMode ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                      <Plus className="size-12 text-muted-foreground/50" />
                      <p className="text-muted-foreground">Click the + button to add your first component</p>
                    </div>
                  ) : components.length > 0 ? (
                    components
                      .filter((componentData) => (componentData as any).type !== 'layout')
                      .map((componentData, index) => {
                      const Component = getComponent(componentData.type);
                      const metadata = componentRegistry[componentData.type as ComponentType];
                      
                      // Check if component accepts data prop (editable components)
                      const isEditable = [
                        'header', 'text', 'button', 'image', 'video', 'embed', 'profile',
                        'gallery', 'skills', 'experience', 'services', 'pricing', 'spacer',
                        'award', 'review', 'contact-form', 'contact-details', 'languages', 'github', 'spotify', 
                        'link-block', 'projects', 'profile-photo', 'tools', 'social-media', 'navigation', 'divider'
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
                          componentType={componentData.type}
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
                          onEdit={() => {
                            setEditingComponentIndex(index);
                          }}
                          componentName={metadata.name}
                          isPreviewMode={isPreviewMode}
                          isSelected={selectedComponentIndex === index}
                          borderRadius={designPalette.borderRadius}
                        >
                          <div 
                            data-editor-component 
                            data-component-id={componentData.id}
                            id={(componentData as any).anchor || componentData.id}
                            style={{
                              ...((componentData as any).styles || {}),
                              padding: ((componentData as any).styles as any)?.padding || undefined,
                              margin: ((componentData as any).styles as any)?.margin || undefined,
                              backgroundColor: ((componentData as any).styles as any)?.backgroundColor || undefined,
                            }}
                            className={cn(
                              (componentData as any).alignment === 'center' && 'text-center',
                              (componentData as any).alignment === 'right' && 'text-right',
                              (componentData as any).alignment === 'left' && 'text-left'
                            )}
                          >
                            {isEditable ? (
                              <EditableComponent 
                                data={componentData} 
                                isPreviewMode={true}
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
                        if (!activeComponent || !activeComponent.type || (activeComponent as any).type === 'layout') return 'Section';
                        const metadata = componentRegistry[activeComponent.type as ComponentType];
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

      {/* Component Selection Modal - Draggable */}
      <Dialog open={isComponentModalOpen} onOpenChange={(open) => {
        setIsComponentModalOpen(open);
        if (!open) setComponentInsertIndex(undefined);
      }}>
        <DialogContent className="max-w-3xl h-[500px] max-h-[500px] overflow-hidden flex flex-col">
          <DialogHeader 
            className="cursor-move select-none flex-shrink-0"
            onMouseDown={(e) => {
              const dialog = (e.currentTarget.closest('[role="dialog"]') as HTMLElement);
              if (!dialog) return;
              
              const startX = e.clientX;
              const startY = e.clientY;
              const rect = dialog.getBoundingClientRect();
              const initialX = rect.left;
              const initialY = rect.top;

              const handleMouseMove = (e: MouseEvent) => {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                dialog.style.position = 'fixed';
                dialog.style.left = `${initialX + deltaX}px`;
                dialog.style.top = `${initialY + deltaY}px`;
                dialog.style.transform = 'none';
                dialog.style.margin = '0';
              };

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <DialogTitle>Add Component</DialogTitle>
          </DialogHeader>
          
          {/* Search Bar */}
          <div className="relative mb-4 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>

          {/* Component List - Grouped by Category with max height and scroll */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                        className="text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-colors group"
                      >
                        <div className="font-medium text-sm text-foreground group-hover:text-primary-foreground">
                          {component.name}
                        </div>
                        <div className="text-xs text-muted-foreground group-hover:text-primary-foreground/80 mt-1">
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

      {/* Component Edit Modal */}
      {editingComponentIndex !== undefined && components[editingComponentIndex] && (
        <ComponentEditModal
          component={components[editingComponentIndex]}
          componentIndex={editingComponentIndex}
          onUpdate={(updatedData) => {
            handleUpdateComponent(editingComponentIndex, updatedData);
          }}
          onClose={() => {
            setEditingComponentIndex(undefined);
          }}
          designPalette={designPalette}
        />
      )}
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
  onEdit,
  componentName,
  isPreviewMode,
  isSelected,
  borderRadius,
  componentId,
  componentType,
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
  onEdit: () => void;
  componentName: string;
  isPreviewMode: boolean;
  isSelected?: boolean;
  borderRadius: string;
  componentId: string;
  componentType?: string;
}) {
  const [isHovered, setIsHovered] = React.useState(false);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
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

  // Show controls when selected or hovered
  const showControls = isSelected || isHovered;

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    // Delay hiding controls (like left side)
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isSelected) {
        setIsHovered(false);
      }
    }, 200);
  };

  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  if (isPreviewMode) {
    // Add default padding and max-width to all components except images
    const isImage = componentType === 'image' || componentType === 'gallery';
    const isFullWidth = componentType === 'image' || componentType === 'gallery' || componentType === 'video';
    const isGallery = componentType === 'gallery';
    
    return (
      <div className={cn(
        "w-full *:border-none *:shadow-none *:border-b-0 **:shadow-none **:border-b-0",
        !isImage && "px-4 sm:px-6 md:px-8",
        !isFullWidth && "max-w-4xl mx-auto",
        isGallery && "max-w-6xl mx-auto"
      )}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group transition-all duration-200",
        showControls && "bg-muted/20",
        isDragging && "z-50"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left Side Controls - Drag and Remove */}
      <div
        className={cn(
          "absolute -left-14 top-0 flex flex-col items-center gap-1.5 transition-opacity z-30",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Drag Handle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9 bg-background hover:bg-muted cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Drag to reorder</TooltipContent>
        </Tooltip>

        {/* Remove */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9 bg-background hover:bg-destructive hover:text-destructive-foreground"
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

      {/* Top Bar - Component Name with Edit and Duplicate Buttons */}
      {showControls && (
        <div 
          className="absolute -top-10 left-0 z-20 flex items-center gap-2 pointer-events-auto max-w-4xl"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="px-3 py-1.5 rounded-md bg-foreground text-background text-xs font-medium">
            {componentName}
          </div>
          <div className="flex items-center gap-1.5">
            {/* Edit Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="default"
                  className="h-8 w-8 bg-primary hover:bg-primary/90 text-primary-foreground pointer-events-auto z-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onEdit();
                  }}
                  type="button"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
            
            {/* Duplicate Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 bg-background hover:bg-muted pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDuplicate();
                  }}
                  type="button"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Duplicate</TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Add Component Button - Center Bottom */}
      {showControls && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-20">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="default"
                className="h-9 w-9 rounded-full"
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
      <div className="w-full relative" onClick={(e) => {
        // Don't trigger select if clicking on buttons
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        onSelect?.();
      }}>
        {children}
      </div>
    </div>
  );
}

// Component Edit Modal - This is a simplified version, you may need to add more component-specific editors
function ComponentEditModal({
  component,
  componentIndex,
  onUpdate,
  onClose,
  designPalette,
}: {
  component: ComponentData;
  componentIndex: number;
  onUpdate: (data: ComponentData) => void;
  onClose: () => void;
  designPalette: DesignPalette;
}) {
  const [localData, setLocalData] = React.useState<ComponentData>(component);
  
  // Filter out layout components
  if ((component as any).type === 'layout') {
    return null;
  }
  
  // Check if component type exists in registry
  if (!component.type || !componentRegistry[component.type as ComponentType]) {
    console.error(`Component type "${component.type}" not found in registry`);
    return (
      <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <p className="text-destructive">
            Component type "{component.type}" is not supported for editing.
          </p>
          <Button onClick={onClose}>Close</Button>
        </DialogContent>
      </Dialog>
    );
  }
  
  let Component: React.ComponentType<any>;
  try {
    Component = getComponent(component.type as ComponentType);
  } catch (error) {
    console.error('Error getting component:', error);
    return (
      <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <p className="text-destructive">
            Failed to load component editor. Please try again.
          </p>
          <Button onClick={onClose}>Close</Button>
        </DialogContent>
      </Dialog>
    );
  }
  
  const metadata = componentRegistry[component.type as ComponentType];
  const styles = (localData as any).styles || {};

  React.useEffect(() => {
    setLocalData(component);
  }, [component]);

  const handleSave = () => {
    onUpdate(localData);
    onClose();
  };

  const handleCancel = () => {
    // Reset to original component data
    setLocalData(component);
    onClose();
  };

  const updateLocalData = (updatedData: ComponentData) => {
    // Only update local state, don't call onUpdate until save
    setLocalData(updatedData);
  };

  const updateStyles = (styleUpdates: Record<string, string | undefined>) => {
    const currentStyles = (localData as any).styles || {};
    const newStyles = { ...currentStyles, ...styleUpdates };
    const updatedData = { ...localData, styles: newStyles } as any;
    // Only update local state, don't call onUpdate until save
    setLocalData(updatedData);
  };

  const isEditable = [
    'header', 'text', 'button', 'image', 'video', 'embed', 'profile',
    'gallery', 'skills', 'experience', 'services', 'pricing', 'spacer',
    'award', 'review', 'contact-form', 'contact-details', 'languages', 'github', 'spotify', 
    'link-block', 'projects', 'profile-photo', 'tools', 'social-media', 'navigation', 'divider'
  ].includes(component.type);

  const EditableComponent = Component as React.ComponentType<{
    data: ComponentData;
    isPreviewMode: boolean;
    onUpdate: (data: ComponentData) => void;
    designPalette?: DesignPalette;
  }>;

  if (!component) {
    return null;
  }

  return (
    <Dialog 
      open={true} 
      onOpenChange={(open) => {
        if (!open) {
          handleCancel();
        }
      }}
    >
      <DialogContent 
        className="max-w-2xl h-[85vh] overflow-hidden flex flex-col p-0"
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold">
            {metadata?.name || component.type}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="space-y-6">
            {/* For spacer, only show height control */}
            {component.type === 'spacer' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Type className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Spacing</h3>
                </div>
                <div className="p-4 border border-border rounded-lg bg-muted/20">
                  <EditableComponent
                    data={localData}
                    isPreviewMode={false}
                    onUpdate={updateLocalData}
                    designPalette={designPalette}
                  />
                </div>
              </div>
            ) : isEditable && EditableComponent ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <Type className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">Content</h3>
                  </div>
                  <div className="p-4 border border-border rounded-lg bg-muted/20 space-y-4">
                    <EditableComponent
                      data={localData}
                      isPreviewMode={false}
                      onUpdate={updateLocalData}
                      designPalette={designPalette}
                    />
                  </div>
                </div>

                {/* Basic Styling - Hide for spacer, divider, gallery, and embed */}
                {component.type !== 'spacer' && component.type !== 'divider' && component.type !== 'gallery' && component.type !== 'embed' && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 pb-2">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold text-foreground">Styling</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {(component.type === 'header' || component.type === 'text') ? (
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1.5">Text Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={(localData as any).fontColor || designPalette.titleColor || "#000000"}
                              onChange={(e) => {
                                const updated = { ...localData, fontColor: e.target.value } as any;
                                setLocalData(updated);
                              }}
                              className="w-10 h-9 rounded border border-border cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={(localData as any).fontColor || ""}
                              onChange={(e) => {
                                const updated = { ...localData, fontColor: e.target.value } as any;
                                setLocalData(updated);
                              }}
                              placeholder={designPalette.titleColor || "#000000"}
                              className="flex-1 h-9 text-xs font-mono"
                            />
                          </div>
                        </div>
                      ) : component.type !== 'button' ? (
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1.5">Text Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={styles.color || designPalette.titleColor || "#000000"}
                              onChange={(e) => updateStyles({ color: e.target.value })}
                              className="w-10 h-9 rounded border border-border cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={styles.color || ""}
                              onChange={(e) => updateStyles({ color: e.target.value })}
                              placeholder={designPalette.titleColor || "#000000"}
                              className="flex-1 h-9 text-xs font-mono"
                            />
                          </div>
                        </div>
                      ) : null}
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1.5">Background</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={styles.backgroundColor || designPalette.backgroundColor || "#ffffff"}
                            onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
                            className="w-10 h-9 rounded border border-border cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={styles.backgroundColor || ""}
                            onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
                            placeholder={designPalette.backgroundColor || "#ffffff"}
                            className="flex-1 h-9 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <MetricInput
                        label="Width"
                        value={styles.width || ''}
                        onChange={(value) => updateStyles({ width: value })}
                        placeholder="100%"
                      />
                      <MetricInput
                        label="Height"
                        value={styles.height || ''}
                        onChange={(value) => updateStyles({ height: value })}
                        placeholder="auto"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <MetricInput
                        label="Padding"
                        value={styles.padding || ''}
                        onChange={(value) => updateStyles({ padding: value })}
                        placeholder="16px"
                      />
                      <MetricInput
                        label="Margin"
                        value={styles.margin || ''}
                        onChange={(value) => updateStyles({ margin: value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

