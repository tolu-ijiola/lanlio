"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronLeft, ChevronDown, Trash2, Keyboard } from "lucide-react";
import { useEditorStore } from "@/stores/editor-v2/store";
import { LayoutPanel } from "./inspector-panels/layout-panel";
import { StylePanel } from "./inspector-panels/style-panel";
import { TypographyPanel } from "./inspector-panels/typography-panel";
import { EffectsPanel } from "./inspector-panels/effects-panel";
import { ContentPanel } from "./inspector-panels/content-panel";
import { ComprehensiveContentPanel } from "./inspector-panels/comprehensive-content-panel";

// Accordion Item Component
function AccordionItem({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[oklch(0.9200_0.005_20)]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[oklch(0.9600_0.008_30)] transition-colors"
      >
        <span className="text-xs font-medium text-[oklch(0.2200_0.015_20)]">{title}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
        ) : (
          <ChevronRight className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export function RightInspector() {
  const {
    rightSidebarCollapsed,
    toggleRightSidebar,
    selectedComponentIds,
    components,
    deleteComponent,
  } = useEditorStore();

  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({
    content: true,
    layout: false,
    style: false,
    typography: false,
    effects: false,
  });

  const togglePanel = (panel: string) => {
    setOpenPanels((prev) => ({ ...prev, [panel]: !prev[panel] }));
  };

  const selectedComponent = selectedComponentIds.length === 1
    ? components.find((c) => c.id === selectedComponentIds[0])
    : null;

  // Determine which panels to show based on component type
  const getVisiblePanels = () => {
    if (!selectedComponent) return [];
    
    const panels: Array<{ id: string; title: string; component: React.ReactNode }> = [];
    
    // Use comprehensive panel for supported types (they have built-in tabs)
    if (["header", "text", "button", "image", "video", "navigation", "gallery", "contact-details", "contact-form", "profile", "skills", "experience", "projects", "services", "pricing", "review", "languages", "award", "tools", "github", "spotify", "layout"].includes(selectedComponent.type)) {
      const comprehensivePanel = <ComprehensiveContentPanel component={selectedComponent} />;
      if (comprehensivePanel) {
        panels.push({
          id: "content",
          title: "Properties",
          component: comprehensivePanel,
        });
      }
    } else {
      // Content panel - show for iframe, profile, etc (not video/gallery - they're in comprehensive)
      // Content panel - show for all other components
      panels.push({ id: "content", title: "Content", component: <ContentPanel component={selectedComponent} /> });
      
      // Typography panel - show for text components (not header/text/button - they're in comprehensive)
      if (["profile"].includes(selectedComponent.type)) {
        panels.push({
          id: "typography",
          title: "Typography",
          component: <TypographyPanel component={selectedComponent} />,
        });
      }
      
      // Layout panel - show for components that don't have comprehensive panel
      if (!["header", "text", "button", "image", "video", "navigation", "gallery", "contact-details", "contact-form", "profile", "skills", "experience", "projects", "services", "pricing", "review", "languages", "award", "tools", "github", "spotify"].includes(selectedComponent.type)) {
        panels.push({
          id: "layout",
          title: "Layout",
          component: <LayoutPanel component={selectedComponent} />,
        });
      }
      
      // Style panel - show for components that don't have comprehensive panel
      if (!["header", "text", "button", "image", "video", "navigation", "gallery"].includes(selectedComponent.type)) {
        panels.push({
          id: "style",
          title: "Style",
          component: <StylePanel component={selectedComponent} />,
        });
      }
      
      // Effects panel - show for components that don't have comprehensive panel
      if (!["header", "text", "button", "image", "video", "navigation", "gallery"].includes(selectedComponent.type)) {
        panels.push({
          id: "effects",
          title: "Effects",
          component: <EffectsPanel component={selectedComponent} />,
        });
      }
    }
    
    return panels;
  };

  if (rightSidebarCollapsed) {
    return (
      <div className="w-14 border-l border-[oklch(0.9200_0.005_20)] bg-white flex flex-col items-center py-3 gap-2">
        <button
          onClick={toggleRightSidebar}
          className="p-2 hover:bg-[oklch(0.9600_0.008_30)] rounded-lg transition-colors"
          title="Expand Inspector"
        >
          <ChevronLeft className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
        </button>
      </div>
    );
  }

  const visiblePanels = selectedComponent ? getVisiblePanels() : [];

  return (
    <div className="w-64 border-l border-[oklch(0.9200_0.005_20)] bg-white flex flex-col h-full transition-all duration-300">
      {/* Header */}
      <div className="h-12 border-b border-[oklch(0.9200_0.005_20)] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleRightSidebar}
            className="p-1.5 hover:bg-[oklch(0.9600_0.008_30)] rounded transition-colors"
            title="Collapse Inspector"
          >
            <ChevronRight className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          </button>
          <span className="text-xs font-medium text-[oklch(0.2200_0.015_20)]">
            {selectedComponent ? "Properties" : "Inspector"}
          </span>
        </div>
        {selectedComponent && (
          <button
            onClick={() => {
              selectedComponentIds.forEach((id) => deleteComponent(id));
            }}
            className="p-1.5 hover:bg-red-50 rounded transition-colors text-red-600 hover:text-red-700"
            title="Delete Component (Delete)"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content - Accordion */}
      <div className="flex-1 overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {!selectedComponent ? (
          <div className="p-6 text-center text-xs text-[oklch(0.5200_0.015_25)]">
            {selectedComponentIds.length === 0
              ? "Select a component to edit its properties"
              : `${selectedComponentIds.length} components selected`}
          </div>
        ) : (
          <div className="divide-y divide-[oklch(0.9200_0.005_20)]">
            {visiblePanels.map((panel) => (
              <AccordionItem
                key={panel.id}
                title={panel.title}
                isOpen={openPanels[panel.id] ?? false}
                onToggle={() => togglePanel(panel.id)}
              >
                {panel.component}
              </AccordionItem>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
