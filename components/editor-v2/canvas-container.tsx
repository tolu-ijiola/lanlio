"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { useEditorStore } from "@/stores/editor-v2/store";
import { componentRegistry, getComponent } from "@/lib/component-registry";
import { useDroppable } from "@dnd-kit/core";
import { HTMLBlock } from "./html-block";
import { LayoutComponent } from "./layout-component";
import { ComponentData } from "@/lib/editor-state";

// Drop Zone Component - Premium Design
function DropZone({
  index,
  isActive,
}: {
  index: number;
  isActive: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-zone-${index}`,
  });

  const isActiveDrop = isOver || isActive;

  return (
    <div
      ref={setNodeRef}
      className={`relative transition-all duration-300 ${
        isActiveDrop
          ? "h-12 my-4"
          : "h-2 my-2"
      }`}
    >
      {isActiveDrop && (
          <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full shadow-lg" style={{ background: `linear-gradient(to right, oklch(0.6500_0.22_25), oklch(0.7000_0.22_25))` }}>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-white">Drop here</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          </div>
          <div className="absolute inset-0 border-2 border-dashed border-[oklch(0.6500_0.22_25)] rounded-lg opacity-30" />
        </div>
      )}
      {!isActiveDrop && (
        <div className="h-full w-full opacity-0 hover:opacity-100 transition-opacity">
          <div className="h-full border-t border-dashed border-[oklch(0.9200_0.005_20)]" />
        </div>
      )}
    </div>
  );
}

interface CanvasContainerProps {
  dragOverIndex: number | null;
}

export function CanvasContainer({ dragOverIndex }: CanvasContainerProps) {
  const {
    components,
    selectedComponentIds,
    hoveredComponentId,
    selectComponent,
    setHoveredComponent,
    clearSelection,
    deviceView,
    zoom,
    showGrid,
    designPalette,
    updateComponent,
    rightSidebarCollapsed,
    toggleRightSidebar,
  } = useEditorStore();

  const canvasRef = useRef<HTMLDivElement>(null);

  // Apply design palette
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--palette-primary", designPalette.primaryColor);
    root.style.setProperty("--palette-bg", designPalette.backgroundColor);
    root.style.setProperty("--palette-title", designPalette.titleColor);
    root.style.setProperty("--palette-description", designPalette.descriptionColor);
    root.style.setProperty("--palette-font", designPalette.fontFamily);
    root.style.setProperty("--palette-radius", designPalette.borderRadius);
  }, [designPalette]);

  const getDeviceWidth = () => {
    switch (deviceView) {
      case "mobile":
        return 375;
      case "tablet":
        return 768;
      default:
        return 1440;
    }
  };

  const deviceWidth = getDeviceWidth();
  const contentMaxWidth = 700; // Max content width for website content (4xl equivalent)
  const defaultPadding = 24; // Default section padding
  
  // Filter out components that are children of layouts (they'll be rendered inside layouts)
  const topLevelComponents = components.filter((c) => !(c as any).parentLayoutId);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("canvas-backdrop")) {
      clearSelection();
    }
  };

  // Make canvas droppable
  const { setNodeRef: setCanvasRef, isOver: isCanvasOver } = useDroppable({
    id: "canvas-drop-area",
  });

  return (
    <div
      ref={(node) => {
        canvasRef.current = node;
        setCanvasRef(node);
      }}
      className="flex-1 overflow-auto relative canvas-backdrop"
      onClick={handleCanvasClick}
      style={{
        backgroundImage: showGrid
          ? `radial-gradient(circle, oklch(0.9200_0.005_20) 1px, transparent 1px)`
          : "none",
        backgroundSize: "20px 20px",
        backgroundColor: isCanvasOver
          ? "rgba(0, 0, 0, 0.04)"
          : designPalette.backgroundColor,
      }}
    >
        <div className="flex justify-center items-start min-h-full p-8" data-canvas-container>
          <div
            className="shadow-lg rounded-lg overflow-hidden relative"
            data-canvas-frame
            style={{
              width: `${deviceWidth}px`,
              maxWidth: "100%",
              minHeight: "600px",
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
              backgroundColor: designPalette.backgroundColor,
              color: designPalette.titleColor,
            }}
          >
            {/* Content Container - Full Width */}
            <div className="w-full min-h-full">
              {components.length === 0 ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-lg border-2 border-dashed border-[oklch(0.9200_0.005_20)] flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-[oklch(0.5200_0.015_25)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-[oklch(0.2200_0.015_20)] mb-2">
                      Drag a block here to start building
                    </p>
                    <p className="text-sm text-[oklch(0.5200_0.015_25)]">
                      Add components from the left sidebar
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col" style={{ paddingBottom: '4rem' }}>
                  {/* Initial Drop Zone */}
                  <div className="w-full max-w-[700px] mx-auto px-6">
                    <DropZone index={0} isActive={dragOverIndex === 0} />
                  </div>

                  {topLevelComponents.map((componentData: ComponentData, index: number) => {
                    // Check if this is a layout component
                    const isLayout = (componentData as any).isLayout === true;
                    const layoutType = (componentData as any).layoutType;
                    const layoutDirection = (componentData as any).direction;
                    
                    // Check if this is an HTML block
                    const isHTMLBlock = componentData.type === "html";
                    
                    // Get component, with fallback for types not in registry
                    let Component: React.ComponentType<any> | null = null;
                    if (isLayout) {
                      // Layout components are handled specially
                      Component = null; // Will render layout container
                    } else if (isHTMLBlock) {
                      Component = HTMLBlock;
                    } else {
                      try {
                        const componentType = componentData.type as keyof typeof componentRegistry;
                        if (componentRegistry[componentType]) {
                          Component = getComponent(componentData.type as any);
                        } else {
                          console.warn(`Component type "${componentData.type}" not found in registry`);
                          Component = null;
                        }
                      } catch (e) {
                        console.warn(`Error getting component "${componentData.type}":`, e);
                        Component = null;
                      }
                    }
                    
                    const isSelected = selectedComponentIds.includes(componentData.id);
                    const isHovered = hoveredComponentId === componentData.id;
                    const componentMetadata = componentRegistry[componentData.type as keyof typeof componentRegistry];
                    const componentName = componentMetadata?.name || componentData.type;

                    return (
                      <React.Fragment key={componentData.id}>
                        <div
                          id={`component-${componentData.id}`}
                          className={`relative group w-full ${
                            isSelected || isHovered ? "z-10" : "z-0"
                          }`}
                          onMouseEnter={() => setHoveredComponent(componentData.id)}
                          onMouseLeave={() => setHoveredComponent(null)}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectComponent(componentData.id, e.shiftKey);
                            // Open right sidebar when component is selected
                            if (rightSidebarCollapsed) {
                              toggleRightSidebar();
                            }
                          }}
                        >
                          {/* Selection Overlay - Positioned relative to content */}
                          {(isSelected || isHovered) && (
                            <div
                              className={`absolute inset-0 pointer-events-none z-20 ${
                                isSelected
                                  ? "ring-2 ring-[oklch(0.6500_0.22_25)] ring-offset-1"
                                  : "ring-2 ring-[oklch(0.6500_0.22_25)]/50 ring-offset-1"
                              }`}
                              style={{
                                pointerEvents: 'none',
                              }}
                            >
                              {isSelected && (
                                <div className="absolute -top-6 left-0 bg-[oklch(0.6500_0.22_25)] text-white text-xs px-2 py-0.5 rounded-t flex items-center gap-1 pointer-events-auto">
                                  {componentName}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Component Wrapper - Constrained or Full Width */}
                          <div className={isLayout ? "w-full" : "w-full max-w-[700px] mx-auto px-6"}>
                            {/* Component Content */}
                            <div
                              className={`relative ${
                                isSelected
                                  ? "outline-2 outline-dashed outline-[oklch(0.6500_0.22_25)] outline-offset-2"
                                  : ""
                              }`}
                            >
                              {/* Wrapper for alignment */}
                              <div
                                className="w-full"
                                style={{
                                  display: "flex",
                                  justifyContent: (componentData as any).alignment === "left" ? "flex-start" :
                                                 (componentData as any).alignment === "right" ? "flex-end" : "center",
                                  alignItems: "flex-start",
                                }}
                              >
                                <div
                                    className="w-full"
                                    style={{
                                      // Apply component styles with proper CSS - these apply to the component wrapper
                                      // Responsive Style Merging Logic
                                      ...(() => {
                                        // For layouts, we don't apply styles to the wrapper because the layout component handles them
                                        // This ensures full-width backgrounds work correctly
                                        if (isLayout) return {};

                                        const baseStyles = (componentData as any).styles || {};
                                        const tabletStyles = (componentData as any).tabletStyles || {};
                                        const mobileStyles = (componentData as any).mobileStyles || {};
                                        
                                        let finalStyles = { ...baseStyles };
                                        
                                        if (deviceView === "tablet") {
                                          finalStyles = { ...finalStyles, ...tabletStyles };
                                        } else if (deviceView === "mobile") {
                                          finalStyles = { ...finalStyles, ...tabletStyles, ...mobileStyles };
                                        }
                                        
                                        return {
                                          width: finalStyles.width || "auto",
                                          maxWidth: finalStyles.width || "100%",
                                          height: finalStyles.height || "auto",
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
                                        };
                                      })()
                                    }}
                                >
                              {isLayout ? (
                                // Render layout container with children
                                <LayoutComponent
                                  data={componentData}
                                  children={components.filter((c) => (c as any).parentLayoutId === componentData.id)}
                                  isPreviewMode={true}
                                  onUpdate={() => {}}
                                />
                              ) : !Component ? (
                                <div className="p-4 border border-dashed border-[oklch(0.9200_0.005_20)] rounded-lg text-center text-sm text-[oklch(0.5200_0.015_25)]">
                                  Component type "{componentData.type}" not found. Please use a valid component type.
                                </div>
                              ) : isHTMLBlock ? (
                                <HTMLBlock
                                  data={componentData}
                                  isPreviewMode={true}
                                  onUpdate={() => {}} // Read-only - no updates from canvas
                                />
                              ) : (
                                <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading component...</div>}>
                                  <Component
                                    data={componentData}
                                    isPreviewMode={true}
                                    onUpdate={() => {}} // Read-only - no updates from canvas
                                  />
                                </Suspense>
                              )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Drop Zone After Component */}
                        <div className="w-full max-w-[700px] mx-auto px-6">
                          <DropZone index={index + 1} isActive={dragOverIndex === index + 1} />
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
