"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ComponentData } from "@/lib/editor-state";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { getComponent, componentRegistry } from "@/lib/component-registry";
import { HTMLBlock } from "./html-block";
import { useEditorStore } from "@/stores/editor-v2/store";

interface LayoutComponentProps {
  data: ComponentData;
  children?: ComponentData[]; // Components inside this layout
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

export function LayoutComponent({ data, children = [], isPreviewMode }: LayoutComponentProps) {
  const { selectComponent } = useEditorStore();
  const layoutType = (data as any).layoutType || "single";
  const direction = (data as any).direction || "vertical";
  const styles = (data as any).styles || {};
  const title = (data as any).title || "";
  const backgroundType = (data as any).backgroundType || "none";
  const backgroundColor = (data as any).backgroundColor || "";
  const backgroundImage = (data as any).backgroundImage || "";
  const backgroundVideo = (data as any).backgroundVideo || "";
  const backgroundUrl = (data as any).backgroundUrl || "";
  const backgroundOverlay = (data as any).backgroundOverlay || false;
  const backgroundOverlayColor = (data as any).backgroundOverlayColor || "#000000";
  const backgroundOverlayOpacity = (data as any).backgroundOverlayOpacity || 0.5;
  const height = (data as any).height || "auto";
  const hasBackground = backgroundType !== "none";
  
  const [fetchedImage, setFetchedImage] = useState<string>("");
  
  // Fetch image from URL if backgroundType is 'url'
  useEffect(() => {
    if (backgroundType === 'url' && backgroundUrl) {
      setFetchedImage(backgroundUrl);
    } else {
      setFetchedImage("");
    }
  }, [backgroundType, backgroundUrl]);
  
  // Make layout droppable
  const { setNodeRef, isOver } = useDroppable({
    id: `layout-${data.id}`,
  });
  
  // Draggable component inside layout - memoized to prevent infinite loops
  const DraggableChild = React.memo(({ child }: { child: ComponentData }) => {
    const { selectedComponentIds, hoveredComponentId, setHoveredComponent } = useEditorStore();
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: `component-${child.id}`,
      data: { type: child.type },
    });
    
    const style = useMemo(() => transform ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined, [transform]);

    const Component = useMemo(() => getComponent(child.type as any), [child.type]);
    const isSelected = selectedComponentIds.includes(child.id);
    const isHovered = hoveredComponentId === child.id;
    
    const handleMouseEnter = useCallback(() => {
      setHoveredComponent(child.id);
    }, [child.id, setHoveredComponent]);
    
    const handleMouseLeave = useCallback(() => {
      setHoveredComponent(null);
    }, [setHoveredComponent]);
    
    const handleClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      selectComponent(child.id, false);
    }, [child.id, selectComponent]);
    
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={`relative cursor-move ${isDragging ? "opacity-50" : ""} ${isSelected || isHovered ? "z-10" : "z-0"}`}
      >
        {/* Selection Overlay */}
        {(isSelected || isHovered) && (
          <div
            className={`absolute inset-0 pointer-events-none ${
              isSelected
                ? "ring-2 ring-[oklch(0.6500_0.22_25)] ring-offset-1"
                : "ring-2 ring-[oklch(0.6500_0.22_25)]/50 ring-offset-1"
            }`}
            style={{
              margin: "-4px",
              borderRadius: "4px",
            }}
          />
        )}
        <Component data={child} isPreviewMode={true} onUpdate={() => {}} />
      </div>
    );
  });

  // Make each column droppable
  const ColumnDropZone = ({ columnIndex, totalColumns, width, alignment }: { columnIndex: number; totalColumns: number; width?: number; alignment?: string }) => {
    const { setNodeRef: setColRef, isOver: isColOver } = useDroppable({
      id: `layout-${data.id}-column-${columnIndex}`,
    });
    
    const columnChildren = children.filter((_, idx) => idx % totalColumns === columnIndex);
    
    return (
      <div
        ref={setColRef}
        className={`min-h-[200px] ${isColOver ? "bg-[oklch(0.6500_0.22_25)]/10 border-2 border-dashed border-[oklch(0.6500_0.22_25)]" : ""} rounded-lg transition-all`}
        style={{ 
          flex: width ? `0 0 ${width}%` : '1',
          maxWidth: width ? `${width}%` : undefined,
          display: 'flex',
          flexDirection: 'column',
          alignItems: alignment || 'flex-start',
        }}
      >
        {columnChildren.length === 0 ? (
          <div className="h-full w-full border-2 border-dashed border-[oklch(0.9200_0.005_20)] rounded-lg flex items-center justify-center text-sm text-[oklch(0.5200_0.015_25)]">
            {isColOver ? "Drop here" : `Column ${columnIndex + 1}`}
          </div>
        ) : (
          <div className="w-full space-y-4" style={{ padding: '0.5rem' }}>
            {columnChildren.map((child) => (
              <DraggableChild key={child.id} child={child} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const getBackgroundStyle = () => {
    if (backgroundType === 'color' && backgroundColor) {
      return { backgroundColor };
    } else if (backgroundType === 'image' && backgroundImage) {
      return { 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    } else if (backgroundType === 'url' && fetchedImage) {
      return { 
        backgroundImage: `url(${fetchedImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
    return {};
  };

  const getColumnCount = () => {
    const countMap: Record<string, number> = {
      'single': 1,
      'double': 2,
      'three': 3,
    };
    return countMap[layoutType] || 1;
  };

  const renderLayout = () => {
    const columnCount = getColumnCount();
    let columnWidths = (data as any).columnWidths || [];
    
    // Ensure column widths total 100% if provided
    if (columnWidths.length === columnCount && direction === "horizontal") {
      const total = columnWidths.reduce((sum: number, w: number) => sum + (w || 0), 0);
      if (total !== 100) {
        // Normalize to 100%
        columnWidths = columnWidths.map((w: number) => (w / total) * 100);
      }
    } else if (direction === "horizontal") {
      // Default equal widths
      columnWidths = Array(columnCount).fill(100 / columnCount);
    }
    
    const columnAlignments = (data as any).columnAlignments || Array(columnCount).fill('flex-start');
    
    if (columnCount === 1) {
      return (
        <div className="w-full min-h-[200px]">
          <ColumnDropZone 
            columnIndex={0} 
            totalColumns={1} 
            alignment={columnAlignments[0] || 'flex-start'}
          />
        </div>
      );
    }

    return (
      <div
        className={`w-full min-h-[200px] flex gap-4 ${
          direction === "horizontal" ? "flex-row" : "flex-col"
        }`}
      >
        {Array.from({ length: columnCount }, (_, i) => i).map((colIndex) => (
          <ColumnDropZone 
            key={colIndex} 
            columnIndex={colIndex} 
            totalColumns={columnCount} 
            width={direction === "horizontal" ? columnWidths[colIndex] : undefined}
            alignment={columnAlignments[colIndex] || 'flex-start'}
          />
        ))}
      </div>
    );
  };

  // Parse padding from styles
  const paddingTop = styles.paddingTop || styles.padding || "2rem";
  const paddingBottom = styles.paddingBottom || styles.padding || "2rem";
  const paddingLeft = styles.paddingLeft || styles.padding || "1.5rem";
  const paddingRight = styles.paddingRight || styles.padding || "1.5rem";

  return (
    <div
      ref={setNodeRef}
      className={`relative group ${isOver ? "bg-[oklch(0.6500_0.22_25)]/5" : ""} w-full`}
      style={{
        margin: styles.margin || "0",
        height: height !== "auto" ? height : undefined,
        minHeight: height === "auto" ? "200px" : undefined,
        // Background fills entire outer container
        ...(hasBackground ? getBackgroundStyle() : {}),
        backgroundColor: !hasBackground && styles.backgroundColor ? styles.backgroundColor : undefined,
      }}
    >
      {/* Video background */}
      {backgroundType === 'video' && backgroundVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      )}
      
      {/* Background overlay */}
      {hasBackground && (data as any).backgroundOverlayEnabled && (
        <div
          className="absolute inset-0 z-[1]"
          style={{
            backgroundColor: backgroundOverlayColor,
            opacity: backgroundOverlayOpacity,
          }}
        />
      )}
      
      {/* Content container with max-width - padding is inside here */}
      <div 
        className="relative z-10 w-full max-w-[700px] mx-auto" 
        style={{ 
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
        }}
      >
        {/* Title overlay - hovers on card like link block */}
        {title && (
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--palette-title)' }}>
              {title}
            </h3>
          </div>
        )}
        {renderLayout()}
      </div>
    </div>
  );
}

