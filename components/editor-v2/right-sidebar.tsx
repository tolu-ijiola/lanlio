"use client";

import React, { useState } from "react";
import { Settings, Palette } from "lucide-react";
import { ComponentData, DesignPalette } from "@/lib/editor-state";
import { SEOSettings } from "@/components/editor/seo-settings";
import { componentRegistry } from "@/lib/component-registry";

interface EditorRightSidebarProps {
  activeTab: "style" | "settings";
  onTabChange: (tab: "style" | "settings") => void;
  selectedComponent: ComponentData | undefined;
  onComponentUpdate: (id: string, updates: Partial<ComponentData>) => void;
  designPalette: DesignPalette;
  onDesignPaletteChange: (palette: DesignPalette) => void;
  seoSettings: SEOSettings;
  onSEOSettingsChange: (settings: SEOSettings) => void;
}

export function EditorRightSidebar({
  activeTab,
  onTabChange,
  selectedComponent,
  onComponentUpdate,
  designPalette,
  onDesignPaletteChange,
  seoSettings,
  onSEOSettingsChange,
}: EditorRightSidebarProps) {
  if (!selectedComponent) {
    return (
      <div className="w-80 border-l border-[oklch(0.9200_0.005_20)] bg-white flex flex-col h-full">
        <div className="p-6 text-center text-[oklch(0.5200_0.015_25)]">
          <p className="text-sm">Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const metadata = componentRegistry[selectedComponent.type];

  return (
    <div className="w-80 border-l border-[oklch(0.9200_0.005_20)] bg-white flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-[oklch(0.9200_0.005_20)]">
        <button
          onClick={() => onTabChange("style")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "style"
              ? "text-[oklch(0.6500_0.22_25)] border-b-2 border-[oklch(0.6500_0.22_25)]"
              : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Style</span>
          </div>
        </button>
        <button
          onClick={() => onTabChange("settings")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "settings"
              ? "text-[oklch(0.6500_0.22_25)] border-b-2 border-[oklch(0.6500_0.22_25)]"
              : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "style" ? (
          <div className="space-y-6">
            {/* Component Info */}
            <div>
              <h3 className="text-sm font-semibold text-[oklch(0.2200_0.015_20)] mb-2">
                {metadata.name}
              </h3>
              <p className="text-xs text-[oklch(0.5200_0.015_25)]">{metadata.description}</p>
            </div>

            {/* Component-Specific Properties */}
            <ComponentPropertiesEditor
              component={selectedComponent}
              onUpdate={onComponentUpdate}
            />

            {/* Design Palette (Global) */}
            <div className="pt-4 border-t border-[oklch(0.9200_0.005_20)]">
              <h3 className="text-sm font-semibold text-[oklch(0.2200_0.015_20)] mb-3">
                Design Palette
              </h3>
              <DesignPaletteEditor
                palette={designPalette}
                onChange={onDesignPaletteChange}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[oklch(0.2200_0.015_20)] mb-3">
                SEO Settings
              </h3>
              <SEOSettingsEditor
                settings={seoSettings}
                onChange={onSEOSettingsChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Component Properties Editor
function ComponentPropertiesEditor({
  component,
  onUpdate,
}: {
  component: ComponentData;
  onUpdate: (id: string, updates: Partial<ComponentData>) => void;
}) {
  // This will be expanded based on component type
  // For now, show basic editing for common properties

  if (component.type === "header" || component.type === "text") {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-1.5">
            Content
          </label>
          <textarea
            value={(component as any).content || ""}
            onChange={(e) => onUpdate(component.id, { content: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)] focus:border-transparent resize-none"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-1.5">
            Alignment
          </label>
          <div className="flex gap-2">
            {(["left", "center", "right"] as const).map((align) => (
              <button
                key={align}
                onClick={() => onUpdate(component.id, { alignment: align })}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  (component as any).alignment === align
                    ? "bg-[oklch(0.6500_0.22_25)] text-white"
                    : "bg-[oklch(0.9600_0.008_30)] text-[oklch(0.2200_0.015_20)] hover:bg-[oklch(0.9500_0.03_25)]"
                }`}
              >
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Add more component-specific editors as needed
  return (
    <div className="text-sm text-[oklch(0.5200_0.015_25)]">
      Properties editor for {component.type} coming soon...
    </div>
  );
}

// Design Palette Editor
function DesignPaletteEditor({
  palette,
  onChange,
}: {
  palette: DesignPalette;
  onChange: (palette: DesignPalette) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-1.5">
          Primary Color
        </label>
        <input
          type="color"
          value={palette.primaryColor}
          onChange={(e) => onChange({ ...palette, primaryColor: e.target.value })}
          className="w-full h-10 rounded-lg border border-[oklch(0.9200_0.005_20)] cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-1.5">
          Background Color
        </label>
        <input
          type="color"
          value={palette.backgroundColor}
          onChange={(e) => onChange({ ...palette, backgroundColor: e.target.value })}
          className="w-full h-10 rounded-lg border border-[oklch(0.9200_0.005_20)] cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-1.5">
          Title Color
        </label>
        <input
          type="color"
          value={palette.titleColor}
          onChange={(e) => onChange({ ...palette, titleColor: e.target.value })}
          className="w-full h-10 rounded-lg border border-[oklch(0.9200_0.005_20)] cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-1.5">
          Description Color
        </label>
        <input
          type="color"
          value={palette.descriptionColor}
          onChange={(e) => onChange({ ...palette, descriptionColor: e.target.value })}
          className="w-full h-10 rounded-lg border border-[oklch(0.9200_0.005_20)] cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-1.5">
          Font Family
        </label>
        <select
          value={palette.fontFamily}
          onChange={(e) => onChange({ ...palette, fontFamily: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)] focus:border-transparent"
        >
          <option value="Inter">Inter</option>
          <option value="Poppins">Poppins</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
        </select>
      </div>
    </div>
  );
}

// SEO Settings Editor
function SEOSettingsEditor({
  settings,
  onChange,
}: {
  settings: SEOSettings;
  onChange: (settings: SEOSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-1.5">
          Title
        </label>
        <input
          type="text"
          value={settings.title}
          onChange={(e) => onChange({ ...settings, title: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)] focus:border-transparent"
          placeholder="Page title"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-1.5">
          Description
        </label>
        <textarea
          value={settings.description}
          onChange={(e) => onChange({ ...settings, description: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)] focus:border-transparent resize-none"
          rows={3}
          placeholder="Meta description"
        />
      </div>
    </div>
  );
}

