"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Play,
  Globe,
  ChevronDown,
  Layers,
  Palette,
  X,
  ChevronUp,
  Trash2,
  Copy,
  GripVertical,
} from "lucide-react";
import { useEditorStore } from "@/stores/editor-v2/store";
import { Tooltip } from "./tooltip";
import { GlobalPaletteEditor } from "./global-palette-editor";
import { ComponentData, DesignPalette } from "@/lib/editor-state";
import { componentRegistry, getComponent } from "@/lib/component-registry";
import { HTMLBlock } from "./html-block";
import { LayoutComponent } from "./layout-component";

export function TopNavigation() {
  const {
    projectName,
    setProjectName,
    deviceView,
    setDeviceView,
    zoom,
    setZoom,
    undo,
    redo,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    components,
    designPalette,
    history,
    historyIndex,
  } = useEditorStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [showStack, setShowStack] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Auto-save (no manual save button)
  useEffect(() => {
    if (hasUnsavedChanges && !isSaving) {
      const timeout = setTimeout(() => {
        // Auto-save is handled by the store
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [hasUnsavedChanges, isSaving]);

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return "Never saved";
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `Saved ${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Saved ${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `Saved ${hours}h ago`;
  };

  return (
    <>
      <div className="h-14 border-b border-[oklch(0.9200_0.005_20)] bg-white flex items-center justify-between px-4 gap-4 sticky top-0 z-50 shadow-sm">
        {/* Left Section - Logo & Project Name */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-[oklch(0.6500_0.22_25)] flex items-center justify-center text-white font-bold text-sm shrink-0">
            S
          </div>
          {isEditingName ? (
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setIsEditingName(false);
              }}
              className="px-2 py-1 text-sm font-semibold text-[oklch(0.2200_0.015_20)] bg-transparent border border-[oklch(0.6500_0.22_25)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]/20"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="px-2 py-1 text-sm font-semibold text-[oklch(0.2200_0.015_20)] hover:bg-[oklch(0.9600_0.008_30)] rounded transition-colors truncate"
            >
              {projectName}
              <ChevronDown className="inline-block ml-1 h-3 w-3 opacity-50" />
            </button>
          )}
          {isSaving ? (
            <span className="text-xs text-[oklch(0.5200_0.015_25)]">Saving...</span>
          ) : lastSaved ? (
            <span className="text-xs text-[oklch(0.5200_0.015_25)]">
              {formatTimeAgo(lastSaved)}
            </span>
          ) : null}
        </div>

        {/* Center Section - Device View & Zoom */}
        <div className="flex items-center gap-3">
          {/* Device View Toggle */}
          <div className="flex items-center gap-1 bg-[oklch(0.9600_0.008_30)] rounded-lg p-1">
            <Tooltip content="Desktop (1440px)">
              <button
                onClick={() => setDeviceView("desktop")}
                className={`p-2 rounded transition-all ${
                  deviceView === "desktop"
                    ? "bg-white text-[oklch(0.6500_0.22_25)] shadow-sm"
                    : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
                }`}
              >
                <Monitor className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip content="Tablet (768px)">
              <button
                onClick={() => setDeviceView("tablet")}
                className={`p-2 rounded transition-all ${
                  deviceView === "tablet"
                    ? "bg-white text-[oklch(0.6500_0.22_25)] shadow-sm"
                    : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
                }`}
              >
                <Tablet className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip content="Mobile (375px)">
              <button
                onClick={() => setDeviceView("mobile")}
                className={`p-2 rounded transition-all ${
                  deviceView === "mobile"
                    ? "bg-white text-[oklch(0.6500_0.22_25)] shadow-sm"
                    : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
                }`}
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>

          {/* Zoom Display */}
          <div className="px-3 py-1.5 text-xs font-medium text-[oklch(0.2200_0.015_20)] bg-[oklch(0.9600_0.008_30)] rounded-lg">
            {zoom}%
          </div>

          {/* Fit to Screen */}
          <Tooltip content="Fit to Screen">
            <button
              onClick={() => setZoom(100)}
              className="px-3 py-1.5 text-xs font-medium text-[oklch(0.2200_0.015_20)] bg-[oklch(0.9600_0.008_30)] rounded-lg hover:bg-[oklch(0.9500_0.03_25)] transition-colors"
            >
              Fit
            </button>
          </Tooltip>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Stack Icon */}
          <Tooltip content="Component Stack">
            <button
              onClick={() => setShowStack(!showStack)}
              className={`p-2 rounded transition-all ${
                showStack
                  ? "bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)]"
                  : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)] hover:bg-[oklch(0.9600_0.008_30)]"
              }`}
            >
              <Layers className="h-4 w-4" />
            </button>
          </Tooltip>

          {/* Design Palette Icon */}
          <Tooltip content="Design Palette">
            <button
              onClick={() => setShowPalette(!showPalette)}
              className={`p-2 rounded transition-all ${
                showPalette
                  ? "bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)]"
                  : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)] hover:bg-[oklch(0.9600_0.008_30)]"
              }`}
            >
              <Palette className="h-4 w-4" />
            </button>
          </Tooltip>

          {/* Undo/Redo */}
          <div className="flex items-center gap-1 border-r border-[oklch(0.9200_0.005_20)] pr-2 mr-2">
            <Tooltip content="Undo (Ctrl+Z)">
            <button
                onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)] hover:bg-[oklch(0.9600_0.008_30)] rounded transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                <Undo2 className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip content="Redo (Ctrl+Shift+Z)">
              <button
                onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)] hover:bg-[oklch(0.9600_0.008_30)] rounded transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                <Redo2 className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>

          {/* Preview - Play Icon */}
          <Tooltip content="Preview">
            <button
              onClick={() => setShowPreview(true)}
              className="p-2 text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)] hover:bg-[oklch(0.9600_0.008_30)] rounded transition-all"
            >
              <Play className="h-4 w-4" />
            </button>
          </Tooltip>

          {/* Publish */}
          <button
            className="px-4 py-1.5 text-sm font-medium text-white bg-[oklch(0.6500_0.22_25)] rounded-lg hover:bg-[oklch(0.6000_0.22_25)] transition-all flex items-center gap-2 shadow-sm"
            title="Publish"
          >
            <Globe className="h-4 w-4" />
            Publish
          </button>
        </div>
      </div>

      {/* Design Palette Dropdown */}
      {showPalette && (
        <div className="absolute top-14 right-4 z-50 w-80 bg-white border border-[oklch(0.9200_0.005_20)] rounded-lg shadow-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[oklch(0.2200_0.015_20)]">Design Palette</h3>
            <button
              onClick={() => setShowPalette(false)}
              className="p-1 hover:bg-[oklch(0.9600_0.008_30)] rounded transition-colors"
            >
              <X className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
            </button>
          </div>
          <GlobalPaletteEditor />
        </div>
      )}

      {/* Stack Panel */}
{showStack && <FloatingComponentStackPanel onClose={() => setShowStack(false)} />}

      {/* Preview Overlay */}
      {showPreview && (
        <PreviewOverlayPortal
          components={components}
          designPalette={designPalette}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}

function FloatingComponentStackPanel({ onClose }: { onClose: () => void }) {
  const {
    components,
    reorderComponents,
    deleteComponent,
    duplicateComponent,
    selectComponent,
    selectedComponentIds,
  } = useEditorStore();

  // Helper to find children of a layout
  const getChildren = (layoutId: string) => {
    return components.filter((c) => (c as any).parentLayoutId === layoutId);
  };

  // Helper to get top-level components
  const topLevelComponents = components.filter((c) => !(c as any).parentLayoutId);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const clampPosition = useCallback(
    (x: number, y: number) => {
      if (typeof window === "undefined") return { x, y };
      const panelWidth = panelRef.current?.offsetWidth ?? 288;
      const panelHeight = panelRef.current?.offsetHeight ?? 360;
      const maxX = Math.max(window.innerWidth - panelWidth - 16, 16);
      const maxY = Math.max(window.innerHeight - panelHeight - 16, 16);
      return {
        x: Math.min(Math.max(x, 16), maxX),
        y: Math.min(Math.max(y, 16), maxY),
      };
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPosition({
      x: window.innerWidth - 320,
      y: 96,
    });
    const handleResize = () => {
      setPosition((pos) => clampPosition(pos.x, pos.y));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clampPosition]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    dragOffset.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      setPosition((prev) =>
        clampPosition(
          moveEvent.clientX - dragOffset.current.x,
          moveEvent.clientY - dragOffset.current.y
        )
      );
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });
  };

  const handleMove = (index: number, direction: number) => {
    const topLevelComps = components.filter((c) => !(c as any).parentLayoutId);
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= topLevelComps.length) return;
    
    // Create a new order with all components
    const newOrder = [...components];
    
    // Find the indices in the full components array
    const movedComponent = topLevelComps[index];
    const targetComponent = topLevelComps[targetIndex];
    
    const movedIndex = newOrder.findIndex((c) => c.id === movedComponent.id);
    const targetIndexInFull = newOrder.findIndex((c) => c.id === targetComponent.id);
    
    if (movedIndex === -1 || targetIndexInFull === -1) return;
    
    const [moved] = newOrder.splice(movedIndex, 1);
    newOrder.splice(targetIndexInFull, 0, moved);
    reorderComponents(newOrder);
  };

  const handleSelect = (id: string) => {
    selectComponent(id, false);
    onClose();
  };

  return (
    <div
      ref={panelRef}
      className="fixed z-[900] w-56 max-w-full bg-white border border-[oklch(0.9200_0.005_20)] rounded-lg shadow-lg p-3 space-y-2 cursor-default select-none"
      style={{ top: position.y, left: position.x }}
    >
      <div
        className="flex items-center justify-between pb-2 border-b border-[oklch(0.9200_0.005_20)] cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
      >
        <p className="text-xs font-medium text-[oklch(0.2200_0.015_20)]">
          Stack ({components.length})
        </p>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-[oklch(0.9600_0.008_30)] transition-colors"
        >
          <X className="h-3.5 w-3.5 text-[oklch(0.5200_0.015_25)]" />
        </button>
      </div>

      {topLevelComponents.length === 0 ? (
        <div className="text-center text-xs text-[oklch(0.5200_0.015_25)] py-8">
          No components
        </div>
      ) : (
        <div className="space-y-1 max-h-[50vh] overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {topLevelComponents.map((component, index) => {
            const metadata = componentRegistry[component.type as keyof typeof componentRegistry];
            const isActive = selectedComponentIds.includes(component.id);
            const isLayout = (component as any).isLayout === true;
            const children = isLayout ? getChildren(component.id) : [];
            const topLevelIndex = topLevelComponents.findIndex((c) => c.id === component.id);
            
            return (
              <div key={component.id}>
                <div
                  draggable
                  onDragStart={(e) => {
                    e.stopPropagation();
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", component.id);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const draggedId = e.dataTransfer.getData("text/plain");
                    if (draggedId === component.id) return;
                    
                    const draggedIndex = topLevelComponents.findIndex((c) => c.id === draggedId);
                    const targetIndex = topLevelIndex;
                    
                    if (draggedIndex === -1 || draggedIndex === targetIndex) return;
                    
                    const newOrder = [...topLevelComponents];
                    const [moved] = newOrder.splice(draggedIndex, 1);
                    newOrder.splice(targetIndex, 0, moved);
                    reorderComponents(newOrder);
                  }}
                  onClick={() => handleSelect(component.id)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs cursor-move transition-colors ${
                    isActive
                      ? "bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)]"
                      : "hover:bg-[oklch(0.9600_0.008_30)] text-[oklch(0.5200_0.015_25)]"
                  }`}
                >
                  <GripVertical className="h-3.5 w-3.5 text-[oklch(0.5200_0.015_25)] shrink-0" />
                  <span className="flex-1 truncate text-xs font-medium">
                    {metadata?.name || component.type}
                  </span>
                  {isLayout && children.length > 0 && (
                    <span className="text-[10px] text-[oklch(0.5200_0.015_25)] bg-[oklch(0.9600_0.008_30)] px-1.5 py-0.5 rounded">
                      {children.length}
                    </span>
                  )}
                  <span className="text-[10px] text-[oklch(0.5200_0.015_25)]">#{topLevelIndex + 1}</span>
                </div>
                {isLayout && children.length > 0 && (
                  <div className="ml-4 border-l border-[oklch(0.9200_0.005_20)] pl-2 space-y-1">
                    {children.map((child) => {
                      const childMetadata = componentRegistry[child.type as keyof typeof componentRegistry];
                      const isChildActive = selectedComponentIds.includes(child.id);
                      return (
                        <div
                          key={child.id}
                          onClick={() => handleSelect(child.id)}
                          className={`flex items-center gap-2 px-2 py-1 rounded text-xs cursor-pointer transition-colors ${
                            isChildActive
                              ? "bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)]"
                              : "hover:bg-[oklch(0.9600_0.008_30)] text-[oklch(0.5200_0.015_25)]"
                          }`}
                        >
                          <span className="flex-1 truncate text-xs">
                            {childMetadata?.name || child.type}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PreviewOverlayPortal({
  components,
  designPalette,
  onClose,
}: {
  components: ComponentData[];
  designPalette: DesignPalette;
  onClose: () => void;
}) {
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  return (
    <div className="fixed inset-0 z-[950] bg-white flex flex-col">
      {/* Preview Top Bar */}
      <div className="h-14 border-b border-[oklch(0.9200_0.005_20)] bg-white flex items-center justify-between px-4 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[oklch(0.2200_0.015_20)] hover:bg-[oklch(0.9600_0.008_30)] rounded-lg transition-colors"
          >
            <Undo2 className="h-4 w-4" />
            Back to Editor
          </button>
          <div className="h-6 w-px bg-[oklch(0.9200_0.005_20)]" />
          <p className="text-sm font-semibold text-[oklch(0.2200_0.015_20)]">Live Preview</p>
        </div>

        {/* Device Toggles */}
        <div className="flex items-center gap-1 bg-[oklch(0.9600_0.008_30)] rounded-lg p-1">
          <Tooltip content="Desktop">
            <button
              onClick={() => setPreviewDevice("desktop")}
              className={`p-2 rounded transition-all ${
                previewDevice === "desktop"
                  ? "bg-white text-[oklch(0.6500_0.22_25)] shadow-sm"
                  : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
              }`}
            >
              <Monitor className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip content="Tablet">
            <button
              onClick={() => setPreviewDevice("tablet")}
              className={`p-2 rounded transition-all ${
                previewDevice === "tablet"
                  ? "bg-white text-[oklch(0.6500_0.22_25)] shadow-sm"
                  : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
              }`}
            >
              <Tablet className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip content="Mobile">
            <button
              onClick={() => setPreviewDevice("mobile")}
              className={`p-2 rounded transition-all ${
                previewDevice === "mobile"
                  ? "bg-white text-[oklch(0.6500_0.22_25)] shadow-sm"
                  : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
              }`}
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>

        <div className="w-[100px]" /> {/* Spacer for balance */}
      </div>

      {/* Preview Content Area */}
      <div className="flex-1 overflow-auto bg-[oklch(0.9800_0.002_20)] w-full">
        <div
          className="w-full min-h-full"
          style={{ 
            backgroundColor: designPalette.backgroundColor,
          }}
        >
           {/* 
              Note: For true responsive preview, we might need to wrap this in a context provider 
              that overrides the 'deviceView' from the store, or components need to use media queries.
              Since we implemented media-query-like logic in CanvasContainer, we need to ensure 
              PreviewRenderer passes the correct 'deviceView' prop or we rely on CSS.
              
              However, our previous implementation in CanvasContainer used the store's deviceView.
              For this preview to work perfectly with our JS-based responsive logic, we might need to 
              mock the store or pass the deviceView explicitly.
              
              Let's update PreviewOverlayRenderer to accept deviceView.
           */}
          <PreviewOverlayRenderer 
            components={components} 
            designPalette={designPalette} 
            deviceView={previewDevice}
          />
        </div>
      </div>
    </div>
  );
}

function PreviewOverlayRenderer({
  components,
  designPalette,
  deviceView,
}: {
  components: ComponentData[];
  designPalette: DesignPalette;
  deviceView: "desktop" | "tablet" | "mobile";
}) {
  if (components.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-[oklch(0.5200_0.015_25)]">
        Add components to see a preview.
      </div>
    );
  }

  // Filter out components that are children of layouts
  const topLevelComponents = components.filter((c) => !(c as any).parentLayoutId);

  return (
    <div className="w-full min-h-full" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="w-full flex flex-col">
        {topLevelComponents.map((component) => {
          const baseStyles = (component as any).styles || {};
          const tabletStyles = (component as any).tabletStyles || {};
          const mobileStyles = (component as any).mobileStyles || {};
          
          let finalStyles = { ...baseStyles };
          
          if (deviceView === "tablet") {
            finalStyles = { ...finalStyles, ...tabletStyles };
          } else if (deviceView === "mobile") {
            finalStyles = { ...finalStyles, ...tabletStyles, ...mobileStyles };
          }

          const isLayout = (component as any).isLayout === true;
          
          return (
            <div
              key={component.id}
              className={isLayout ? "w-full" : "w-full"}
              data-editor-component
            >
              {isLayout ? (
                // Layout components render full width
                renderPreviewOverlayComponent(component)
              ) : (
                // Regular components have max-width container
                <div className="w-full max-w-[700px] mx-auto px-6">
                  <div
                    style={{
                      width: finalStyles.width || 'auto',
                      maxWidth: finalStyles.width || '100%',
                      height: finalStyles.height || 'auto',
                      padding: finalStyles.padding || 
                              ((finalStyles.paddingTop || finalStyles.paddingRight || finalStyles.paddingBottom || finalStyles.paddingLeft)
                                ? `${finalStyles.paddingTop || 0} ${finalStyles.paddingRight || 0} ${finalStyles.paddingBottom || 0} ${finalStyles.paddingLeft || 0}`
                                : undefined),
                      margin: finalStyles.margin ||
                              ((finalStyles.marginTop || finalStyles.marginRight || finalStyles.marginBottom || finalStyles.marginLeft)
                                ? `${finalStyles.marginTop || 0} ${finalStyles.marginRight || 0} ${finalStyles.marginBottom || 0} ${finalStyles.marginLeft || 0}`
                                : undefined),
                      backgroundColor: finalStyles.backgroundColor || undefined,
                      color: finalStyles.color || undefined,
                      borderWidth: finalStyles.borderWidth || undefined,
                      borderRadius: finalStyles.borderRadius || undefined,
                      display: 'flex',
                      justifyContent: (component as any).alignment === 'left' ? 'flex-start' :
                                       (component as any).alignment === 'right' ? 'flex-end' : 'center',
                      alignItems: 'flex-start',
                    }}
                  >
                    {renderPreviewOverlayComponent(component, components)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function renderPreviewOverlayComponent(component: ComponentData, allComponents: ComponentData[] = []) {
  const isLayout = (component as any).isLayout;
  if (isLayout) {
    const layoutChildren = allComponents.filter((c) => (c as any).parentLayoutId === component.id);
    return (
      <LayoutComponent
        data={component}
        children={layoutChildren}
        isPreviewMode={true}
        onUpdate={() => {}}
      />
    );
  }

  const isHTMLBlock = component.type === "html";

  if (isHTMLBlock) {
    return <HTMLBlock data={component} isPreviewMode={true} onUpdate={() => {}} />;
  }

  try {
    const Component = getComponent(component.type as any);
    if (!Component) {
      throw new Error("Missing component");
    }
    return (
      <Suspense fallback={<div className="text-xs text-[oklch(0.5200_0.015_25)]">Loading...</div>}>
        <Component
          data={component}
          isPreviewMode={true}
          onUpdate={() => {}}
        />
      </Suspense>
    );
  } catch {
    return (
      <div className="text-xs text-[oklch(0.5200_0.015_25)]">
        Component type "{component.type}" is not available in preview.
      </div>
    );
  }
}

function ComponentStackPanel({ onClose }: { onClose: () => void }) {
  const {
    components,
    reorderComponents,
    deleteComponent,
    duplicateComponent,
    selectComponent,
    selectedComponentIds,
  } = useEditorStore();

  // Helper to find children of a layout
  const getChildren = (layoutId: string) => {
    return components.filter((c) => (c as any).parentLayoutId === layoutId);
  };

  // Helper to get top-level components
  const topLevelComponents = components.filter((c) => !(c as any).parentLayoutId);

  const handleMove = (index: number, direction: number) => {
    const topLevelComps = components.filter((c) => !(c as any).parentLayoutId);
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= topLevelComps.length) return;
    
    // Create a new order with all components
    const newOrder = [...components];
    
    // Find the indices in the full components array
    const movedComponent = topLevelComps[index];
    const targetComponent = topLevelComps[targetIndex];
    
    const movedIndex = newOrder.findIndex((c) => c.id === movedComponent.id);
    const targetIndexInFull = newOrder.findIndex((c) => c.id === targetComponent.id);
    
    if (movedIndex === -1 || targetIndexInFull === -1) return;
    
    const [moved] = newOrder.splice(movedIndex, 1);
    newOrder.splice(targetIndexInFull, 0, moved);
    reorderComponents(newOrder);
  };

  const handleSelect = (id: string) => {
    selectComponent(id, false);
    onClose();
  };

  return (
    <div className="fixed top-16 right-4 z-[900] w-80 bg-white border border-[oklch(0.9200_0.005_20)] rounded-2xl shadow-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[oklch(0.2200_0.015_20)]">Component Stack</p>
          <p className="text-xs text-[oklch(0.5200_0.015_25)]">
            {components.length} {components.length === 1 ? "block" : "blocks"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-[oklch(0.9600_0.008_30)] transition-colors"
        >
          <X className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
        </button>
      </div>
      {topLevelComponents.length === 0 ? (
        <div className="text-center text-xs text-[oklch(0.5200_0.015_25)] py-8">
          No components yet. Drag items from the left sidebar.
        </div>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-1">
          {topLevelComponents.map((component, index) => {
            const metadata = componentRegistry[component.type as keyof typeof componentRegistry];
            const isActive = selectedComponentIds.includes(component.id);
            const isLayout = (component as any).isLayout === true;
            const children = isLayout ? getChildren(component.id) : [];
            const topLevelIndex = topLevelComponents.findIndex((c) => c.id === component.id);
            
            return (
              <div key={component.id}>
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    isActive
                      ? "border-[oklch(0.6500_0.22_25)] bg-[oklch(0.6500_0.22_25)]/5"
                      : "border-[oklch(0.9200_0.005_20)] hover:border-[oklch(0.6500_0.22_25)]/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] truncate">
                        {metadata?.name || component.type}
                      </p>
                      <p className="text-[10px] uppercase tracking-wide text-[oklch(0.5200_0.015_25)]">
                        #{topLevelIndex + 1}
                        {isLayout && children.length > 0 && ` • ${children.length} children`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleMove(topLevelIndex, -1)}
                        disabled={topLevelIndex === 0}
                        className="p-1.5 rounded-lg border border-transparent hover:border-[oklch(0.9200_0.005_20)] disabled:opacity-40"
                      >
                        <ChevronUp className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
                      </button>
                      <button
                        onClick={() => handleMove(topLevelIndex, 1)}
                        disabled={topLevelIndex === topLevelComponents.length - 1}
                        className="p-1.5 rounded-lg border border-transparent hover:border-[oklch(0.9200_0.005_20)] disabled:opacity-40"
                      >
                        <ChevronDown className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
                      </button>
                    </div>
                  </div>
                  {isLayout && children.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[oklch(0.9200_0.005_20)] space-y-1">
                      {children.map((child) => {
                        const childMetadata = componentRegistry[child.type as keyof typeof componentRegistry];
                        const isChildActive = selectedComponentIds.includes(child.id);
                        return (
                          <div
                            key={child.id}
                            onClick={() => handleSelect(child.id)}
                            className={`flex items-center gap-2 px-2 py-1 rounded text-xs cursor-pointer transition-colors ${
                              isChildActive
                                ? "bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)]"
                                : "hover:bg-[oklch(0.9600_0.008_30)] text-[oklch(0.5200_0.015_25)]"
                            }`}
                          >
                            <span className="flex-1 truncate text-xs">
                              {childMetadata?.name || child.type}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleSelect(component.id)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)] hover:bg-[oklch(0.6500_0.22_25)]/20 transition"
                    >
                      Focus
                    </button>
                    <button
                      onClick={() => duplicateComponent(component.id)}
                      className="p-1.5 rounded-lg hover:bg-[oklch(0.9600_0.008_30)] transition"
                    >
                      <Copy className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
                    </button>
                    <button
                      onClick={() => deleteComponent(component.id)}
                      className="p-1.5 rounded-lg hover:bg-[oklch(0.9600_0.008_30)] transition"
                    >
                      <Trash2 className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PreviewOverlay({
  components,
  designPalette,
  onClose,
}: {
  components: ComponentData[];
  designPalette: DesignPalette;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[950] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[oklch(0.9200_0.005_20)]">
          <div>
            <p className="text-base font-semibold text-[oklch(0.2200_0.015_20)]">Live Preview</p>
            <p className="text-xs text-[oklch(0.5200_0.015_25)]">Read-only preview of your page</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[oklch(0.9600_0.008_30)] transition-colors"
          >
            <X className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          </button>
        </div>
        <div
          className="flex-1 overflow-auto"
          style={{ backgroundColor: designPalette.backgroundColor }}
        >
          <PreviewRenderer components={components} designPalette={designPalette} />
        </div>
      </div>
    </div>
  );
}

function PreviewRenderer({
  components,
  designPalette,
}: {
  components: ComponentData[];
  designPalette: DesignPalette;
}) {
  if (components.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-[oklch(0.5200_0.015_25)]">
        Add components to see a preview.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 space-y-6">
      {components.map((component) => (
        <div
          key={component.id}
          className="bg-white rounded-[24px] shadow-lg border border-[oklch(0.9200_0.005_20)]/60 p-6"
          data-editor-component
        >
          {renderPreviewOverlayComponent(component)}
        </div>
      ))}
    </div>
  );
}

function renderPreviewComponent(component: ComponentData) {
  const isLayout = (component as any).isLayout;
  if (isLayout) {
    return (
      <div className="text-sm text-[oklch(0.5200_0.015_25)]">
        Layout previews are coming soon.
      </div>
    );
  }

  const isHTMLBlock = component.type === "html";

  if (isHTMLBlock) {
    return <HTMLBlock data={component} isPreviewMode={true} onUpdate={() => {}} />;
  }

  try {
    const Component = getComponent(component.type as any);
    if (!Component) {
      throw new Error("Missing component");
    }
    return (
      <Component
        data={component}
        isPreviewMode={true}
        onUpdate={() => {}}
      />
    );
  } catch (error) {
    return (
      <div className="text-xs text-[oklch(0.5200_0.015_25)]">
        Component type "{component.type}" is not available in preview.
      </div>
    );
  }
}
