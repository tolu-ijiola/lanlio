"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/stores/editor-v2/store";

export function KeyboardShortcuts() {
  const {
    addComponent,
    selectedComponentIds,
    duplicateComponent,
    deleteComponent,
    undo,
    redo,
    setZoom,
    toggleLeftSidebar,
    toggleRightSidebar,
    zoom,
  } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      // Insert (I)
      if (e.key === "i" && !ctrlOrCmd && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        // Open component picker or add default component
        addComponent("text");
      }

      // Duplicate (Ctrl/Cmd + D)
      if (e.key === "d" && ctrlOrCmd && selectedComponentIds.length > 0) {
        e.preventDefault();
        duplicateComponent(selectedComponentIds[0]);
      }

      // Delete (Delete or Backspace)
      if ((e.key === "Delete" || e.key === "Backspace") && selectedComponentIds.length > 0) {
        e.preventDefault();
        selectedComponentIds.forEach((id) => deleteComponent(id));
      }

      // Undo (Ctrl/Cmd + Z)
      if (e.key === "z" && ctrlOrCmd && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo (Ctrl/Cmd + Shift + Z)
      if (e.key === "z" && ctrlOrCmd && e.shiftKey) {
        e.preventDefault();
        redo();
      }

      // Zoom: Ctrl/Cmd + Plus
      if ((e.key === "=" || e.key === "+") && ctrlOrCmd) {
        e.preventDefault();
        setZoom(Math.min(200, zoom + 25));
      }

      // Zoom: Ctrl/Cmd + Minus
      if (e.key === "-" && ctrlOrCmd) {
        e.preventDefault();
        setZoom(Math.max(25, zoom - 25));
      }

      // Zoom: 1 = 100%
      if (e.key === "1" && !ctrlOrCmd && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        setZoom(100);
      }

      // Zoom: 0 = Fit
      if (e.key === "0" && !ctrlOrCmd && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        setZoom(100); // Fit logic can be added
      }

      // Toggle Left Sidebar (Ctrl/Cmd + B)
      if (e.key === "b" && ctrlOrCmd) {
        e.preventDefault();
        toggleLeftSidebar();
      }

      // Toggle Right Sidebar (Ctrl/Cmd + .)
      if (e.key === "." && ctrlOrCmd) {
        e.preventDefault();
        toggleRightSidebar();
      }

      // Save (Ctrl/Cmd + S)
      if (e.key === "s" && ctrlOrCmd) {
        e.preventDefault();
        // Save will be handled by the save function
      }

      // Show shortcuts (Ctrl/Cmd + ?)
      if (e.key === "?" && ctrlOrCmd) {
        e.preventDefault();
        // Shortcuts display is handled by KeyboardShortcutsDisplay component
      }

      // Close shortcuts (Escape)
      if (e.key === "Escape") {
        // Escape handling is in KeyboardShortcutsDisplay
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    addComponent,
    selectedComponentIds,
    duplicateComponent,
    deleteComponent,
    undo,
    redo,
    setZoom,
    zoom,
    toggleLeftSidebar,
    toggleRightSidebar,
  ]);

  return null;
}



