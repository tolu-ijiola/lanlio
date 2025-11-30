"use client";

import React, { useState, useMemo } from "react";
import {
  Blocks,
  Package,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Upload,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Type,
  Image,
  MousePointerClick,
  Code,
  Square,
  Grid3x3,
  Search,
  ChevronDown,
  ChevronUp,
  Video,
  Users,
  Star,
  Mail,
  Phone,
  Globe,
  Music,
  Github,
  MessageSquare,
  DollarSign,
  FolderOpen,
  Trophy,
  Languages,
  Wrench,
  Share2,
  Minus,
  Link2,
  Layout,
  Plus,
} from "lucide-react";
import { useEditorStore } from "@/stores/editor-v2/store";
import { componentRegistry, ComponentType } from "@/lib/component-registry";
import { useDraggable } from "@dnd-kit/core";

// Draggable Item Component
function DraggableItem({
  type,
  name,
  icon,
  variant,
  itemKey,
}: {
  type: ComponentType | "layout" | "html-block" | string;
  name: string;
  icon?: React.ReactNode;
  variant?: string;
  itemKey?: string;
}) {
  // Ensure type is always a string and not empty
  const safeType = String(type || "").trim();
  // Use a stable ID based on type, variant, and optional key
  const uniqueId = React.useMemo(
    () => `draggable-${safeType}-${variant || "default"}${itemKey ? `-${itemKey}` : ""}`,
    [safeType, variant, itemKey]
  );
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: uniqueId,
    data: { 
      type: safeType, 
      variant: variant || undefined 
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="group flex flex-col items-center gap-2 p-3 border border-[oklch(0.9200_0.005_20)] rounded-lg hover:border-[oklch(0.6500_0.22_25)] hover:bg-[oklch(0.9950_0.003_15)] cursor-grab active:cursor-grabbing transition-all"
    >
      <div className="w-10 h-10 flex items-center justify-center text-[oklch(0.5200_0.015_25)] group-hover:text-[oklch(0.6500_0.22_25)] transition-colors">
        {icon || <Package className="h-5 w-5" />}
      </div>
      <span className="text-xs font-medium text-[oklch(0.2200_0.015_20)] text-center">{name}</span>
      {variant && (
        <span className="text-xs text-[oklch(0.5200_0.015_25)] bg-[oklch(0.9600_0.008_30)] px-1.5 py-0.5 rounded">
          {variant}
        </span>
      )}
    </div>
  );
}

type ComponentItem = {
  type: string;
  name: string;
  icon: React.ReactNode;
  variant?: string;
  variants?: string[];
};

type ComponentCategory = {
  name: string;
  icon: React.ReactNode;
  components: ComponentItem[];
};

// Component Categories
const componentCategories: Record<string, ComponentCategory> = {
  text: {
    name: "Text",
    icon: <Type className="h-4 w-4" />,
    components: [
      { type: "header", name: "Heading", icon: <Type className="h-5 w-5" /> },
      { type: "text", name: "Text", icon: <Type className="h-5 w-5" /> },
      { type: "button", name: "Button", icon: <MousePointerClick className="h-5 w-5" /> },
    ],
  },
  media: {
    name: "Media",
    icon: <Image className="h-4 w-4" />,
    components: [
      { type: "image", name: "Image", icon: <Image className="h-5 w-5" /> },
      { type: "video", name: "Video", icon: <Video className="h-5 w-5" /> },
      { type: "gallery", name: "Gallery", icon: <Grid3x3 className="h-5 w-5" /> },
      { type: "embed", name: "Embed", icon: <Code className="h-5 w-5" /> },
      { type: "html", name: "HTML Block", icon: <Code className="h-5 w-5" /> },
      { type: "profile-photo", name: "Profile Photo", icon: <Users className="h-5 w-5" /> },
    ],
  },
  content: {
    name: "Content",
    icon: <FileText className="h-4 w-4" />,
    components: [
      { type: "skills", name: "Skills", icon: <Award className="h-5 w-5" />, variants: ["Pills", "Grid"] },
      { type: "experience", name: "Experience", icon: <Briefcase className="h-5 w-5" />, variants: ["Timeline", "Card"] },
      { type: "projects", name: "Projects", icon: <FolderOpen className="h-5 w-5" /> },
      { type: "services", name: "Services", icon: <Briefcase className="h-5 w-5" /> },
      { type: "pricing", name: "Pricing", icon: <DollarSign className="h-5 w-5" /> },
      { type: "review", name: "Reviews", icon: <Star className="h-5 w-5" /> },
      { type: "award", name: "Awards", icon: <Trophy className="h-5 w-5" /> },
      { type: "tools", name: "Tools", icon: <Wrench className="h-5 w-5" /> },
      { type: "languages", name: "Languages", icon: <Languages className="h-5 w-5" /> },
      { type: "link-block", name: "Link Block", icon: <Link2 className="h-5 w-5" /> },
    ],
  },
  contact: {
    name: "Contact",
    icon: <Mail className="h-4 w-4" />,
    components: [
      { type: "contact-form", name: "Contact Form", icon: <MessageSquare className="h-5 w-5" /> },
      { type: "contact-details", name: "Contact Details", icon: <Phone className="h-5 w-5" /> },
    ],
  },
  social: {
    name: "Social",
    icon: <Share2 className="h-4 w-4" />,
    components: [
      { type: "social-media", name: "Social Media", icon: <Share2 className="h-5 w-5" /> },
      { type: "github", name: "GitHub", icon: <Github className="h-5 w-5" /> },
      { type: "spotify", name: "Spotify", icon: <Music className="h-5 w-5" /> },
    ],
  },
  layouts: {
    name: "Layouts",
    icon: <Layout className="h-4 w-4" />,
    components: [
      { type: "layout", name: "Single Column", icon: <Square className="h-5 w-5" />, variant: "single-vertical" },
      { type: "layout", name: "Double Column", icon: <Grid3x3 className="h-5 w-5" />, variant: "double-horizontal" },
      { type: "layout", name: "Four Column", icon: <Grid3x3 className="h-5 w-5" />, variant: "four-horizontal" },
      { type: "spacer", name: "Spacer", icon: <Minus className="h-5 w-5" /> },
    ],
  },
  blocks: {
    name: "Blocks",
    icon: <Blocks className="h-4 w-4" />,
    components: [
      { type: "navigation", name: "Navigator", icon: <Layout className="h-5 w-5" /> },
      { type: "header", name: "Resume Header", icon: <FileText className="h-5 w-5" />, variants: ["Default", "Modern"] },
      { type: "experience", name: "Experience", icon: <Briefcase className="h-5 w-5" />, variants: ["Timeline", "Card"] },
      { type: "profile", name: "Profile/Education", icon: <GraduationCap className="h-5 w-5" />, variants: ["Default", "Compact"] },
      { type: "skills", name: "Skills", icon: <Award className="h-5 w-5" />, variants: ["Pills", "Grid"] },
    ],
  },
};

export function LeftSidebar() {
  const {
    leftSidebarCollapsed,
    toggleLeftSidebar,
    leftSidebarTab,
    setLeftSidebarTab,
  } = useEditorStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["text", "media", "layouts", "blocks"])
  );

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryKey)) {
        next.delete(categoryKey);
      } else {
        next.add(categoryKey);
      }
      return next;
    });
  };

  // Filter components based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return componentCategories;
    }

    const query = searchQuery.toLowerCase();
    const filtered: Record<string, ComponentCategory> = {};

    Object.entries(componentCategories).forEach(([key, category]) => {
      const filteredComponents = category.components.filter((comp) =>
        comp.name.toLowerCase().includes(query)
      );
      if (filteredComponents.length > 0) {
        filtered[key] = {
          ...category,
          components: filteredComponents,
        };
      }
    });

    return filtered;
  }, [searchQuery]);

  if (leftSidebarCollapsed) {
    return (
      <div className="w-14 border-r border-[oklch(0.9200_0.005_20)] bg-white flex flex-col items-center py-3 gap-2">
        <button
          onClick={toggleLeftSidebar}
          className="p-2 hover:bg-[oklch(0.9600_0.008_30)] rounded-lg transition-colors"
          title="Expand Sidebar"
        >
          <ChevronRight className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
        </button>
        <div className="w-full border-t border-[oklch(0.9200_0.005_20)] my-2" />
        <button
          onClick={() => {
            setLeftSidebarTab("blocks");
            toggleLeftSidebar();
          }}
          className={`p-2 rounded-lg transition-colors ${
            leftSidebarTab === "blocks"
              ? "bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)]"
              : "text-[oklch(0.5200_0.015_25)] hover:bg-[oklch(0.9600_0.008_30)]"
          }`}
          title="Blocks"
        >
          <Blocks className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            setLeftSidebarTab("components");
            toggleLeftSidebar();
          }}
          className={`p-2 rounded-lg transition-colors ${
            leftSidebarTab === "components"
              ? "bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)]"
              : "text-[oklch(0.5200_0.015_25)] hover:bg-[oklch(0.9600_0.008_30)]"
          }`}
          title="Components"
        >
          <Package className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 border-r border-[oklch(0.9200_0.005_20)] bg-white flex flex-col h-full transition-all duration-300">
      {/* Header */}
      <div className="h-12 border-b border-[oklch(0.9200_0.005_20)] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLeftSidebar}
            className="p-1.5 hover:bg-[oklch(0.9600_0.008_30)] rounded transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          </button>
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              onClick={() => setLeftSidebarTab("blocks")}
              className={`px-2 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                leftSidebarTab === "blocks"
                  ? "bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)]"
                  : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
              }`}
            >
              Blocks
            </button>
            <button
              onClick={() => setLeftSidebarTab("components")}
              className={`px-2 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                leftSidebarTab === "components"
                  ? "bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)]"
                  : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
              }`}
            >
              Components
            </button>
            <button
              onClick={() => setLeftSidebarTab("layers")}
              className={`px-2 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                leftSidebarTab === "layers"
                  ? "bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)]"
                  : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
              }`}
            >
              Layers
            </button>
          </div>
        </div>
      </div>

      {leftSidebarTab === "layers" ? (
        <LayersView />
      ) : (
        <>
          {/* Search Bar */}
          <div className="px-4 py-3 border-b border-[oklch(0.9200_0.005_20)] shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search components..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
              />
            </div>
          </div>

          {/* Content - Accordion Categories */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="p-4 space-y-2">
              {Object.entries(filteredCategories).map(([categoryKey, category]) => {
                const isExpanded = expandedCategories.has(categoryKey);
                return (
                  <div key={categoryKey} className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] overflow-hidden">
                    <button
                      onClick={() => toggleCategory(categoryKey)}
                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[oklch(0.9600_0.008_30)] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[oklch(0.5200_0.015_25)]">{category.icon}</span>
                        <span className="text-xs font-medium text-[oklch(0.2200_0.015_20)]">{category.name}</span>
                        <span className="text-xs text-[oklch(0.5200_0.015_25)] bg-[oklch(0.9600_0.008_30)] px-1.5 py-0.5 rounded">
                          {category.components.length}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="border-t border-[oklch(0.9200_0.005_20)] p-2">
                        <div className="grid grid-cols-2 gap-2">
                          {category.components.map((comp: ComponentItem, idx: number) => {
                            if (comp.variants && comp.variants.length > 0) {
                              return comp.variants.map((variant: string, variantIdx: number) => (
                                <DraggableItem
                                  key={`${categoryKey}-${comp.type}-${variant}-${variantIdx}`}
                                  type={comp.type}
                                  name={comp.name}
                                  icon={comp.icon}
                                  variant={variant}
                                  itemKey={`${categoryKey}-${comp.type}-${variant}-${variantIdx}`}
                                />
                              ));
                            }
                            return (
                              <DraggableItem
                                key={`${categoryKey}-${comp.type}-${idx}`}
                                type={comp.type}
                                name={comp.name}
                                icon={comp.icon}
                                variant={comp.variant}
                                itemKey={`${categoryKey}-${comp.type}-${idx}`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Bottom Actions */}
      <div className="border-t border-[oklch(0.9200_0.005_20)] p-4 shrink-0 space-y-2">
        <button className="w-full px-4 py-2 text-xs font-medium bg-[oklch(0.6500_0.22_25)] text-white rounded-lg hover:bg-[oklch(0.6000_0.22_25)] transition-colors flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" />
          Add Page
        </button>
        <button className="w-full px-4 py-2 text-xs font-medium border border-[oklch(0.9200_0.005_20)] rounded-lg hover:bg-[oklch(0.9600_0.008_30)] transition-colors flex items-center justify-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Asset
        </button>
      </div>
    </div>

  );
}

function LayersView() {
  const { components, selectedComponentIds, selectComponent, hoveredComponentId, setHoveredComponent } = useEditorStore();

  // Helper to find children of a layout
  const getChildren = (layoutId: string) => {
    return components.filter((c) => (c as any).parentLayoutId === layoutId);
  };

  // Helper to get top-level components
  const topLevelComponents = components.filter((c) => !(c as any).parentLayoutId);

  const LayerItem = ({ component, depth = 0 }: { component: any; depth: number }) => {
    const isSelected = selectedComponentIds.includes(component.id);
    const isHovered = hoveredComponentId === component.id;
    const isLayout = component.isLayout;
    const children = isLayout ? getChildren(component.id) : [];
    
    // Get icon from registry
    const metadata = componentRegistry[component.type as keyof typeof componentRegistry];
    const iconNode = metadata?.icon;

    return (
      <div className="select-none">
        <div
          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${
            isSelected 
              ? "bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)] font-medium" 
              : isHovered
                ? "bg-[oklch(0.9600_0.008_30)] text-[oklch(0.2200_0.015_20)]"
                : "text-[oklch(0.2200_0.015_20)] hover:bg-[oklch(0.9600_0.008_30)]"
          }`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={(e) => {
            e.stopPropagation();
            selectComponent(component.id, e.shiftKey);
          }}
          onMouseEnter={() => setHoveredComponent(component.id)}
          onMouseLeave={() => setHoveredComponent(null)}
        >
          {iconNode && React.isValidElement(iconNode) ? (
            React.cloneElement(iconNode as React.ReactElement, { className: "h-4 w-4 shrink-0" } as any)
          ) : (
            <Package className="h-4 w-4 shrink-0" />
          )}
          <span className="truncate text-xs">{metadata?.name || component.type}</span>
          {isLayout && (
            <span className="ml-auto text-xs text-[oklch(0.5200_0.015_25)] bg-[oklch(0.9600_0.008_30)] px-1.5 py-0.5 rounded">
              {children.length}
            </span>
          )}
        </div>
        {children.length > 0 && (
          <div className="border-l border-[oklch(0.9200_0.005_20)] ml-4 my-1">
            {children.map((child) => (
              <LayerItem key={child.id} component={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (components.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[oklch(0.5200_0.015_25)]">
        <Layout className="h-8 w-8 mb-2 opacity-20" />
        <p className="text-xs">No components yet</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
      {topLevelComponents.map((component) => (
        <LayerItem key={component.id} component={component} depth={0} />
      ))}
    </div>
  );
}
