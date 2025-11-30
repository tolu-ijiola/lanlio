"use client";

import React, { useEffect, useState } from "react";
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent, DragOverEvent, CollisionDetection } from "@dnd-kit/core";
import { TopNavigation } from "./top-navigation";
import { LeftSidebar } from "./left-sidebar";
import { CanvasContainer } from "./canvas-container";
import { RightInspector } from "./right-inspector";
import { BottomToolbar } from "./bottom-toolbar";
import { AIChatbot } from "./ai-chatbot";
import { KeyboardShortcuts } from "./keyboard-shortcuts";
import { KeyboardShortcutsDisplay } from "./keyboard-shortcuts-display";
import { ToastContainer } from "./toast";
import { useEditorStore } from "@/stores/editor-v2/store";
import { componentRegistry } from "@/lib/component-registry";
import { generateComponentId } from "@/lib/editor-state";

export function EditorShell() {
  const { designPalette, toasts, removeToast, addComponent, reorderComponents, components, zoom, updateComponent } = useEditorStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Custom collision detection that accounts for zoom and canvas bounds
  const zoomAwareCollisionDetection: CollisionDetection = (args) => {
    if (!args.pointerCoordinates) {
      return closestCenter(args);
    }
    
    const zoomScale = zoom / 100;
    const canvasFrame = document.querySelector('[data-canvas-frame]') as HTMLElement;
    const canvasContainer = document.querySelector('[data-canvas-container]') as HTMLElement;
    
    if (!canvasFrame || !canvasContainer) {
      return closestCenter(args);
    }
    
    // Get the container's bounding rect to check bounds
    const containerRect = canvasContainer.getBoundingClientRect();
    
    // Check if pointer is within canvas container bounds
    const isWithinCanvas = 
      args.pointerCoordinates.x >= containerRect.left &&
      args.pointerCoordinates.x <= containerRect.right &&
      args.pointerCoordinates.y >= containerRect.top &&
      args.pointerCoordinates.y <= containerRect.bottom;
    
    if (!isWithinCanvas) {
      return []; // Return empty array to prevent drop outside canvas
    }
    
    // Get the frame's bounding rect (already accounts for transform)
    const frameRect = canvasFrame.getBoundingClientRect();
    
    // Calculate the pointer position relative to the frame's top-left
    // Then scale it back to the original coordinate space
    const relativeX = (args.pointerCoordinates.x - frameRect.left) / zoomScale;
    const relativeY = (args.pointerCoordinates.y - frameRect.top) / zoomScale;
    
    // Adjust pointer coordinates to account for zoom
    const adjustedArgs = {
      ...args,
      pointerCoordinates: {
        x: frameRect.left + relativeX,
        y: frameRect.top + relativeY,
      },
    };
    
    return closestCenter(adjustedArgs);
  };

  // Apply design palette globally - affects all components
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--palette-primary", designPalette.primaryColor);
    root.style.setProperty("--palette-bg", designPalette.backgroundColor);
    root.style.setProperty("--palette-title", designPalette.titleColor);
    root.style.setProperty("--palette-description", designPalette.descriptionColor);
    root.style.setProperty("--palette-font", designPalette.fontFamily);
    root.style.setProperty("--palette-radius", designPalette.borderRadius);
    
    const style = document.createElement("style");
    style.id = "design-palette-global";
    style.textContent = `
      [data-editor-component] {
        --palette-primary: ${designPalette.primaryColor};
        --palette-bg: ${designPalette.backgroundColor};
        --palette-title: ${designPalette.titleColor};
        --palette-description: ${designPalette.descriptionColor};
        font-family: ${designPalette.fontFamily}, sans-serif;
      }
    `;
    document.head.appendChild(style);

    const previousBodyBg = document.body.style.backgroundColor;
    const previousBodyColor = document.body.style.color;
    document.body.style.backgroundColor = designPalette.backgroundColor;
    document.body.style.color = designPalette.descriptionColor;

    return () => {
      style.remove();
      document.body.style.backgroundColor = previousBodyBg;
      document.body.style.color = previousBodyColor;
    };
  }, [designPalette]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      if (dragOverIndex !== null) {
        setDragOverIndex(null);
      }
      return;
    }

    const overId = over.id as string;
    
    // Don't process drag over for components being dragged (prevents infinite loops)
    if (activeId && activeId.toString().startsWith("component-")) {
      // Only update if dropping on a valid drop zone, not on other components
      if (overId.startsWith("drop-zone-")) {
        const newIndex = parseInt(overId.split("-")[2]);
        if (dragOverIndex !== newIndex) {
          setDragOverIndex(newIndex);
        }
      } else if (dragOverIndex !== null) {
        setDragOverIndex(null);
      }
      return;
    }

    let newIndex: number | null = null;

    if (overId.startsWith("drop-zone-")) {
      newIndex = parseInt(overId.split("-")[2]);
    } else if (overId.startsWith("component-") && !overId.includes("-column-")) {
      const componentId = overId.replace("component-", "");
      const index = components.findIndex((c) => c.id === componentId);
      if (index !== -1) {
        newIndex = index + 1;
      }
    }

    // Only update state if the index has changed to prevent infinite loops
    if (dragOverIndex !== newIndex) {
      setDragOverIndex(newIndex);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDragOverIndex(null);

    // Only register drops if they're within the canvas
    if (!over) return;

    const activeData = active.data.current;
    if (!activeData) return;

    // Check if drop is within canvas area
    const overId = over.id as string;
    const layoutComponents = components.filter((c) => (c as any).isLayout);
    const validDropTargets = [
      "canvas-drop-area",
      ...Array.from({ length: components.length + 1 }, (_, i) => `drop-zone-${i}`),
      ...components.map((c) => `component-${c.id}`),
      ...layoutComponents.map((c) => `layout-${c.id}`),
      ...layoutComponents.flatMap((c) => {
        const layoutType = (c as any).layoutType || "single";
        const columnCount = layoutType === "single" ? 1 : layoutType === "double" ? 2 : layoutType === "three" ? 3 : 1;
        return Array.from({ length: columnCount }, (_, i) => `layout-${c.id}-column-${i}`);
      }),
    ];
    
    if (!validDropTargets.includes(overId)) {
      return; // Drop outside canvas - don't register
    }

    // Handle dropping from sidebar
    if (active.id.toString().startsWith("draggable-")) {
      // Get component type from drag data
      const componentType = activeData?.type;
      
      // Fallback: try to extract from ID if data is missing
      let finalType = componentType;
      if (!finalType || finalType === "") {
        const idParts = active.id.toString().split("-");
        if (idParts.length >= 2) {
          finalType = idParts[1]; // Extract type from "draggable-{type}-..."
        }
      }
      
      // Validate component type exists
      if (!finalType || finalType === "" || finalType === "undefined") {
        console.error("Invalid component type from drag:", { activeData, activeId: active.id });
        return;
      }
      
      let insertIdx = components.length;

      // Check if dropping into a layout
      if (overId.startsWith("layout-")) {
        // Check if it's a layout column drop zone
        if (overId.includes("-column-")) {
          const parts = overId.split("-column-");
          const layoutId = parts[0].replace("layout-", "");
          const columnIndex = parseInt(parts[1]);
          const layout = components.find((c) => c.id === layoutId);
          if (layout && (layout as any).isLayout) {
            // Add component as child of layout
            addComponent(finalType as any, components.length, layoutId);
            return;
          }
        } else {
          const layoutId = overId.replace("layout-", "");
          const layout = components.find((c) => c.id === layoutId);
          if (layout && (layout as any).isLayout) {
            // Add component as child of layout
            addComponent(finalType as any, components.length, layoutId);
            return;
          }
        }
      }

      // Determine insert position
      if (overId.startsWith("drop-zone-")) {
        insertIdx = parseInt(overId.split("-")[2]);
      } else if (overId.startsWith("component-")) {
        const componentId = overId.replace("component-", "");
        const idx = components.findIndex((c) => c.id === componentId);
        if (idx !== -1) insertIdx = idx + 1;
      } else if (overId === "canvas-drop-area") {
        insertIdx = components.length;
      }

      // Create component
      if (finalType === "html-block" || finalType === "html") {
        // HTML block
        addComponent("html" as any, insertIdx);
      } else if (finalType === "layout") {
        // Handle layout insertion - create a proper layout container
        const layoutVariant = activeData?.variant || "single-vertical";
        const [layoutType, direction] = layoutVariant.split("-");
        
        // Create layout component
        addComponent(
          "layout" as any,
          insertIdx,
          undefined,
          {
            layoutType,
            direction,
            isLayout: true,
          } as any
        );
      } else {
        // Validate the type exists in registry before adding
        const validTypes = Object.keys(componentRegistry);
        if (validTypes.includes(finalType)) {
          addComponent(finalType as any, insertIdx);
        } else {
          console.error(`Component type "${finalType}" not found in registry. Available types:`, validTypes);
        }
      }
    }
    // Handle reordering existing components or dragging out of layouts
    else if (active.id.toString().startsWith("component-")) {
      const activeComponentId = active.id.toString().replace("component-", "");
      const activeComponent = components.find((c) => c.id === activeComponentId);
      
      if (!activeComponent) return;
      
      // Check if component is being dragged out of a layout
      const parentLayoutId = (activeComponent as any).parentLayoutId;
      
      // If dropping on canvas (not in layout), remove from layout
      if (parentLayoutId && (overId.startsWith("drop-zone-") || overId === "canvas-drop-area" || (overId.startsWith("component-") && !overId.includes("-column-")))) {
        
        // Create new order from current components
        const newOrder = [...components];
        
        // Find the component in the new copy
        const activeIndex = newOrder.findIndex(c => c.id === activeComponentId);
        if (activeIndex === -1) return;
        
        // Update the component to remove parentLayoutId locally in the new order
        newOrder[activeIndex] = {
            ...newOrder[activeIndex],
            parentLayoutId: undefined
        } as any;
        
        // Determine insert position
        let insertIdx = components.length;
        if (overId.startsWith("drop-zone-")) {
          insertIdx = parseInt(overId.split("-")[2]);
        } else if (overId.startsWith("component-") && !overId.includes("-column-")) {
          const overComponentId = overId.replace("component-", "");
          const idx = components.findIndex((c) => c.id === overComponentId);
          if (idx !== -1) insertIdx = idx + 1;
        }
        
        // Adjust insertIdx because we are moving an item within the same list
        // If the item is currently before the insert position, the insert position shifts down by 1
        // But since we splice it out first, we just need to be careful with indices
        
        const [moved] = newOrder.splice(activeIndex, 1);
        
        // If we removed from before the target, the target index in the *spliced* array is (insertIdx - 1)
        // If we removed from after the target, the target index is unchanged
        
        let finalInsertIdx = insertIdx;
        if (activeIndex < insertIdx) {
            finalInsertIdx -= 1;
        }
        
        newOrder.splice(finalInsertIdx, 0, moved);
        reorderComponents(newOrder);
        return;
      }
      
      // Handle reordering within canvas
      if (overId.startsWith("component-") && !overId.includes("-column-")) {
        const overComponentId = overId.replace("component-", "");
        
        const oldIndex = components.findIndex((c) => c.id === activeComponentId);
        const newIndex = components.findIndex((c) => c.id === overComponentId);

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const newOrder = [...components];
          const [moved] = newOrder.splice(oldIndex, 1);
          newOrder.splice(newIndex, 0, moved);
          reorderComponents(newOrder);
        }
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={zoomAwareCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen w-screen flex flex-col bg-[oklch(0.9800_0.002_20)] overflow-hidden">
        <KeyboardShortcuts />
        {/* Top Navigation Bar - Sticky */}
        <TopNavigation />

        {/* Content Zone - Flex Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Collapsible */}
          <LeftSidebar />

          {/* Canvas Container - Center */}
          <CanvasContainer dragOverIndex={dragOverIndex} />

          {/* Right Inspector - Collapsible */}
          <RightInspector />
        </div>

        {/* Bottom Canvas Toolbar */}
        <BottomToolbar />

        {/* AI Chatbot */}
        <AIChatbot />

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />

        {/* Keyboard Shortcuts Display */}
        <KeyboardShortcutsDisplay />

        {/* Drag Overlay */}
        <DragOverlay style={{ pointerEvents: "none", zIndex: 9999 }}>
          {activeId && activeId.toString().startsWith("draggable-") && (
            <div className="opacity-50 bg-white border-2 border-dashed border-[oklch(0.6500_0.22_25)] rounded-lg p-4 shadow-lg max-w-xs">
              <div className="text-sm font-medium text-[oklch(0.6500_0.22_25)] truncate">
                {activeId.toString().replace("draggable-", "").split("-")[0]}
              </div>
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

