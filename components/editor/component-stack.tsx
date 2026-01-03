"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { GripVertical, X, Copy, Trash2 } from "lucide-react";
import { ComponentData } from "@/lib/editor-state";
import { componentRegistry } from "@/lib/component-registry";
import { cn } from "@/lib/utils";

interface ComponentStackProps {
  components: ComponentData[];
  onReorder: (newOrder: ComponentData[]) => void;
  onRemove: (index: number) => void;
  onDuplicate: (index: number) => void;
  currentIndex?: number;
  onSelect?: (index: number) => void;
}

function SortableItem({
  component,
  index,
  onRemove,
  onDuplicate,
  isActive,
  onSelect,
}: {
  component: ComponentData;
  index: number;
  onRemove: () => void;
  onDuplicate: () => void;
  isActive: boolean;
  onSelect?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const metadata = component.type !== 'layout' && component.type in componentRegistry 
    ? componentRegistry[component.type as keyof typeof componentRegistry] 
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex items-center gap-2 p-2 rounded-md border transition-all cursor-pointer",
        isActive ? "bg-primary/10 border-primary/30" : "bg-background border-border hover:border-primary/20 hover:bg-muted/30",
        isDragging && "shadow-lg z-50 opacity-50"
      )}
      onClick={onSelect}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="size-3.5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate leading-tight">
          {metadata?.name || component.type}
        </p>
      </div>
    </div>
  );
}

export default function ComponentStack({
  components,
  onReorder,
  onRemove,
  onDuplicate,
  currentIndex,
  onSelect,
}: ComponentStackProps) {
  const [open, setOpen] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = components.findIndex((c) => c.id === active.id);
      const newIndex = components.findIndex((c) => c.id === over.id);

      const newOrder = arrayMove(components, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="h-12 w-12"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 3v18" />
                <path d="M9 8h6" />
                <path d="M9 12h6" />
                <path d="M9 16h6" />
              </svg>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="right" align="center">Sections</TooltipContent>
      </Tooltip>
      <PopoverContent
        side="right"
        align="start"
        className="w-64 p-3 max-h-[600px] flex flex-col"
      >
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Sections</h3>
          <p className="text-xs text-muted-foreground">
            {components.length}
          </p>
        </div>

        {components.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-xs">
            No sections yet
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto -mx-1 px-1">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={components.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1.5">
                  {components.map((component, index) => (
                    <SortableItem
                      key={component.id}
                      component={component}
                      index={index}
                      isActive={currentIndex === index}
                      onRemove={() => onRemove(index)}
                      onDuplicate={() => onDuplicate(index)}
                      onSelect={() => {
                        onSelect?.(index);
                        setOpen(false);
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

