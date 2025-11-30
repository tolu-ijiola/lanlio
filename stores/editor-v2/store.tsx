"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ComponentData, DesignPalette, defaultDesignPalette } from "@/lib/editor-state";
import { getWebsiteById } from "@/lib/supabase/websites";
import { getCurrentUserId } from "@/lib/supabase/auth";
import { createWebsite, updateWebsite } from "@/lib/supabase/websites";
import { generateSlug, generateUniqueDomain } from "@/lib/supabase/websites";
import { getTemplateById } from "@/lib/templates";
import { SEOSettings } from "@/components/editor/seo-settings";
import { generateComponentId, getDefaultComponentData } from "@/lib/editor-state";

interface EditorState {
  // Project
  projectName: string;
  currentPageId: string;
  pages: Array<{ id: string; name: string; isDefault: boolean }>;
  
  // Canvas
  components: ComponentData[];
  selectedComponentIds: string[];
  hoveredComponentId: string | null;
  
  // Design
  designPalette: DesignPalette;
  seoSettings: SEOSettings;
  
  // UI State
  leftSidebarCollapsed: boolean;
  rightSidebarCollapsed: boolean;
  leftSidebarTab: "blocks" | "components" | "layers";
  rightSidebarTab: "layout" | "style" | "typography" | "effects" | "data" | "advanced";
  
  // Canvas State
  deviceView: "desktop" | "tablet" | "mobile";
  zoom: number;
  showRulers: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  snapToElements: boolean;
  
  // History
  history: ComponentData[][];
  historyIndex: number;
  
  // Save State
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  
  // Website
  websiteId: string | null;
  
  // Toasts
  toasts: Array<{ id: string; message: string; type?: "success" | "error" | "info" }>;
}

interface EditorActions {
  setProjectName: (name: string) => void;
  setCurrentPage: (pageId: string) => void;
  addPage: (name: string) => void;
  deletePage: (pageId: string) => void;
  duplicatePage: (pageId: string) => void;
  setDefaultPage: (pageId: string) => void;
  
  addComponent: (
    type: ComponentData["type"],
    insertIndex?: number,
    parentLayoutId?: string,
    overrides?: Partial<ComponentData>
  ) => void;
  updateComponent: (id: string, updates: Partial<ComponentData>) => void;
  deleteComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  reorderComponents: (newOrder: ComponentData[]) => void;
  
  selectComponent: (id: string, multi?: boolean) => void;
  deselectComponent: (id: string) => void;
  clearSelection: () => void;
  setHoveredComponent: (id: string | null) => void;
  
  setDesignPalette: (palette: DesignPalette) => void;
  setSEOSettings: (settings: SEOSettings) => void;
  
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
    setLeftSidebarTab: (tab: "blocks" | "components" | "layers") => void;
  setRightSidebarTab: (tab: "layout" | "style" | "typography" | "effects" | "data" | "advanced") => void;
  
  setDeviceView: (view: "desktop" | "tablet" | "mobile") => void;
  setZoom: (zoom: number) => void;
  toggleRulers: () => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  toggleSnapToElements: () => void;
  
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
  
  save: () => Promise<void>;
  initializeEditor: () => void;
  loadWebsite: (id: string) => Promise<void>;
  loadTemplate: (id: string) => void;
  
  // Toast
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
}

type EditorStore = EditorState & EditorActions;

const EditorContext = createContext<EditorStore | null>(null);

const initialState: EditorState = {
  projectName: "Untitled",
  currentPageId: "page-1",
  pages: [{ id: "page-1", name: "Home", isDefault: true }],
  components: [],
  selectedComponentIds: [],
  hoveredComponentId: null,
  designPalette: defaultDesignPalette,
  seoSettings: { title: "", description: "", ogImage: "", canonicalUrl: "" },
  leftSidebarCollapsed: false,
  rightSidebarCollapsed: false,
  leftSidebarTab: "blocks",
  rightSidebarTab: "layout",
  deviceView: "desktop",
  zoom: 100,
  showRulers: false,
  showGrid: true,
  snapToGrid: true,
  snapToElements: true,
  history: [[]],
  historyIndex: 0,
  isSaving: false,
  lastSaved: null,
  hasUnsavedChanges: false,
  websiteId: null,
  toasts: [],
};

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<EditorState>(() => {
    // Load persisted UI state from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("editor-v2-ui-state");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return { ...initialState, ...parsed };
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
    return initialState;
  });

  // Persist UI state
  useEffect(() => {
    const uiState = {
      leftSidebarCollapsed: state.leftSidebarCollapsed,
      rightSidebarCollapsed: state.rightSidebarCollapsed,
      leftSidebarTab: state.leftSidebarTab,
      rightSidebarTab: state.rightSidebarTab,
      deviceView: state.deviceView,
      zoom: state.zoom,
      showRulers: state.showRulers,
      showGrid: state.showGrid,
      snapToGrid: state.snapToGrid,
      snapToElements: state.snapToElements,
    };
    localStorage.setItem("editor-v2-ui-state", JSON.stringify(uiState));
  }, [
    state.leftSidebarCollapsed,
    state.rightSidebarCollapsed,
    state.leftSidebarTab,
    state.rightSidebarTab,
    state.deviceView,
    state.zoom,
    state.showRulers,
    state.showGrid,
    state.snapToGrid,
    state.snapToElements,
  ]);

  type ComponentChangeResult = {
    components: ComponentData[];
    extra?: Partial<EditorState>;
  };

  const applyComponentChange = useCallback(
    (fn: (state: EditorState) => ComponentChangeResult) => {
      setState((s) => {
        const { components: nextComponents, extra } = fn(s);
        const newHistory = [
          ...s.history.slice(0, s.historyIndex + 1),
          [...nextComponents],
        ];
        return {
          ...s,
          ...extra,
          components: nextComponents,
          history: newHistory.slice(-50),
          historyIndex: newHistory.length - 1,
          hasUnsavedChanges: true,
        };
      });
    },
    []
  );

  const saveHistory = useCallback(() => {
    setState((s) => {
      const newHistory = s.history.slice(0, s.historyIndex + 1);
      newHistory.push([...s.components]);
      return {
        ...s,
        history: newHistory.slice(-50),
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const actions: EditorActions = {
    setProjectName: (name) =>
      setState((s) => ({ ...s, projectName: name, hasUnsavedChanges: true })),
    
    setCurrentPage: (pageId) => setState((s) => ({ ...s, currentPageId: pageId })),
    
    addPage: (name) =>
      setState((s) => {
        const newPage = { id: `page-${Date.now()}`, name, isDefault: false };
        return {
          ...s,
          pages: [...s.pages, newPage],
          currentPageId: newPage.id,
          components: [],
          selectedComponentIds: [],
        };
      }),
    
    deletePage: (pageId) =>
      setState((s) => {
        if (s.pages.length === 1) return s;
        const newPages = s.pages.filter((p) => p.id !== pageId);
        return {
          ...s,
          pages: newPages,
          currentPageId: newPages[0].id,
          components: [],
          selectedComponentIds: [],
        };
      }),
    
    duplicatePage: (pageId) =>
      setState((s) => {
        const page = s.pages.find((p) => p.id === pageId);
        if (!page) return s;
        const newPage = { id: `page-${Date.now()}`, name: `${page.name} Copy`, isDefault: false };
        return { ...s, pages: [...s.pages, newPage] };
      }),
    
    setDefaultPage: (pageId) =>
      setState((s) => ({
        ...s,
        pages: s.pages.map((p) => ({ ...p, isDefault: p.id === pageId })),
      })),

    addComponent: (type, insertIndex, parentLayoutId, overrides) => {
      const id = overrides?.id ?? generateComponentId();
      const defaultData = getDefaultComponentData(type, id);
      const componentData: ComponentData = {
        ...defaultData,
        ...(parentLayoutId ? { parentLayoutId } : {}),
        ...(overrides || {}),
        styles: {
          ...(defaultData as any).styles,
          ...(overrides?.styles || {}),
        },
      } as ComponentData;

      applyComponentChange((s) => {
        const newComponents =
          insertIndex !== undefined
            ? [
                ...s.components.slice(0, insertIndex),
                componentData,
                ...s.components.slice(insertIndex),
              ]
            : [...s.components, componentData];
        return {
          components: newComponents,
          extra: { selectedComponentIds: [id] },
        };
      });
    },

    updateComponent: (id, updates) => {
      applyComponentChange((s) => ({
        components: s.components.map((comp) =>
          comp.id === id ? { ...comp, ...updates } : comp
        ),
      }));
    },

    deleteComponent: (id) => {
      applyComponentChange((s) => {
        const newComponents = s.components.filter((comp) => comp.id !== id);
        const newSelected = s.selectedComponentIds.filter((sid) => sid !== id);
        return {
          components: newComponents,
          extra: { selectedComponentIds: newSelected },
        };
      });
    },

    duplicateComponent: (id) => {
      applyComponentChange((s) => {
        const component = s.components.find((c) => c.id === id);
        if (!component) {
          return { components: s.components };
        }
        const newId = generateComponentId();
        const duplicated = { ...component, id: newId };
        const index = s.components.findIndex((c) => c.id === id);
        const newComponents = [...s.components];
        newComponents.splice(index + 1, 0, duplicated);
        return {
          components: newComponents,
          extra: { selectedComponentIds: [newId] },
        };
      });
    },

    reorderComponents: (newOrder) => {
      applyComponentChange(() => ({
        components: newOrder,
      }));
    },

    selectComponent: (id, multi = false) =>
      setState((s) => ({
        ...s,
        selectedComponentIds: multi
          ? s.selectedComponentIds.includes(id)
            ? s.selectedComponentIds.filter((sid) => sid !== id)
            : [...s.selectedComponentIds, id]
          : [id],
      })),

    deselectComponent: (id) =>
      setState((s) => ({
        ...s,
        selectedComponentIds: s.selectedComponentIds.filter((sid) => sid !== id),
      })),

    clearSelection: () => setState((s) => ({ ...s, selectedComponentIds: [] })),
    setHoveredComponent: (id) => setState((s) => ({ ...s, hoveredComponentId: id })),

    setDesignPalette: (palette) =>
      setState((s) => ({ ...s, designPalette: palette, hasUnsavedChanges: true })),
    setSEOSettings: (settings) =>
      setState((s) => ({ ...s, seoSettings: settings, hasUnsavedChanges: true })),

    toggleLeftSidebar: () =>
      setState((s) => ({ ...s, leftSidebarCollapsed: !s.leftSidebarCollapsed })),
    toggleRightSidebar: () =>
      setState((s) => ({ ...s, rightSidebarCollapsed: !s.rightSidebarCollapsed })),
    setLeftSidebarTab: (tab) => setState((s) => ({ ...s, leftSidebarTab: tab as "blocks" | "components" | "layers" })),
    setRightSidebarTab: (tab) => setState((s) => ({ ...s, rightSidebarTab: tab })),

    setDeviceView: (view) => setState((s) => ({ ...s, deviceView: view })),
    setZoom: (zoom) => setState((s) => ({ ...s, zoom })),
    toggleRulers: () => setState((s) => ({ ...s, showRulers: !s.showRulers })),
    toggleGrid: () => setState((s) => ({ ...s, showGrid: !s.showGrid })),
    toggleSnapToGrid: () => setState((s) => ({ ...s, snapToGrid: !s.snapToGrid })),
    toggleSnapToElements: () => setState((s) => ({ ...s, snapToElements: !s.snapToElements })),

    undo: () => {
      setState((s) => {
        if (s.historyIndex > 0) {
          const newIndex = s.historyIndex - 1;
          return {
            ...s,
            historyIndex: newIndex,
            components: [...s.history[newIndex]],
            hasUnsavedChanges: true,
          };
        }
        return s;
      });
    },

    redo: () => {
      setState((s) => {
        if (s.historyIndex < s.history.length - 1) {
          const newIndex = s.historyIndex + 1;
          return {
            ...s,
            historyIndex: newIndex,
            components: [...s.history[newIndex]],
            hasUnsavedChanges: true,
          };
        }
        return s;
      });
    },

    saveHistory,

    save: async () => {
      setState((s) => ({ ...s, isSaving: true }));
      try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error("User not authenticated");

        const currentState = state;
        const slug = generateSlug(currentState.projectName);
        const domain = await generateUniqueDomain(slug, userId);

        if (currentState.websiteId) {
          await updateWebsite(currentState.websiteId, {
            name: currentState.projectName,
            components: currentState.components,
            design_palette: currentState.designPalette,
            seo_settings: currentState.seoSettings,
          });
        } else {
          const newWebsite = await createWebsite({
            user_id: userId,
            name: currentState.projectName,
            slug,
            domain,
            components: currentState.components,
            design_palette: currentState.designPalette,
            seo_settings: currentState.seoSettings,
            status: "draft",
          });
          if (newWebsite) {
            setState((s) => ({ ...s, websiteId: newWebsite.id }));
          }
        }
        const toastId = `toast-${Date.now()}`;
        setState((s) => ({
          ...s,
          lastSaved: new Date(),
          hasUnsavedChanges: false,
          isSaving: false,
          toasts: [...s.toasts, { id: toastId, message: "Saved successfully", type: "success" }],
        }));
      } catch (error) {
        console.error("Error saving:", error);
        setState((s) => ({ ...s, isSaving: false }));
      }
    },

    initializeEditor: () => {
      setState({
        ...initialState,
        leftSidebarCollapsed: state.leftSidebarCollapsed,
        rightSidebarCollapsed: state.rightSidebarCollapsed,
      });
    },

    loadWebsite: async (id: string) => {
      const website = await getWebsiteById(id);
      if (website) {
        setState((s) => ({
          ...s,
          projectName: website.name,
          components: website.components,
          designPalette: website.design_palette,
          seoSettings: website.seo_settings,
          websiteId: website.id,
          history: [website.components],
          historyIndex: 0,
          hasUnsavedChanges: false,
        }));
      }
    },

    loadTemplate: (id: string) => {
      const template = getTemplateById(id);
      if (template) {
        setState((s) => ({
          ...s,
          projectName: template.name,
          components: template.components,
          designPalette: template.designPalette || defaultDesignPalette,
          history: [template.components],
          historyIndex: 0,
          hasUnsavedChanges: false,
          websiteId: null,
        }));
      }
    },

    addToast: (message, type = "success") => {
      const id = `toast-${Date.now()}`;
      setState((s) => ({
        ...s,
        toasts: [...s.toasts, { id, message, type }],
      }));
    },

    removeToast: (id) => {
      setState((s) => ({
        ...s,
        toasts: s.toasts.filter((t) => t.id !== id),
      }));
    },
  };

  const store: EditorStore = { ...state, ...actions };

  return <EditorContext.Provider value={store}>{children}</EditorContext.Provider>;
}

export function useEditorStore(): EditorStore {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorStore must be used within EditorProvider");
  }
  return context;
}

