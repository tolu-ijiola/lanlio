"use client";

import React, { useState } from "react";
import { ComponentData, NavigationComponentData, ContactDetailsComponentData, ContactFormComponentData, LayoutComponentData } from "@/lib/editor-state";
import { useEditorStore } from "@/stores/editor-v2/store";
import {
  Type, AlignLeft, AlignCenter, AlignRight, Link2, Link, ExternalLink, Upload, Image as ImageIcon,
  Video, Code, Minus, Maximize2, Play, Volume2, VolumeX, Repeat, Eye, EyeOff,
  Grid3x3, Layout, Palette, Sparkles, Settings, Sliders, Ruler, Monitor, Tablet, Smartphone,
  Bold, Italic, Underline, Strikethrough, ArrowUp, ArrowDown, Hash, Percent, Maximize,
  Layers, ImagePlus, FileText, MousePointerClick, Briefcase, Award, Users, Star,
  Mail, Phone, MapPin, Globe, Calendar, Music, Github, MessageSquare, DollarSign,
  FolderOpen, Trophy, Languages, Wrench, Share2, Zap, Heart, Download, Search,
  ArrowRight, Twitter, Linkedin, Instagram, Facebook, Youtube, Plus, X, ChevronDown,
  ChevronUp, Lock, Unlock, Eye as EyeIcon, EyeOff as EyeOffIcon, Copy, Trash2,
  Move, GripVertical, RotateCw, Sparkle, FileCode, Shield, AlertTriangle, CheckSquare,
  User
} from "lucide-react";
import { TabbedPanel } from "./tabbed-panel";
import { Tooltip } from "../tooltip";

// Reusable Input Components
function InputField({ label, icon, value, onChange, placeholder, type = "text", ...props }: any) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
        {icon && <span className="h-3.5 w-3.5">{icon}</span>}
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)] resize-none"
          rows={4}
          {...props}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
          {...props}
        />
      )}
    </div>
  );
}

function SliderField({ label, icon, value, onChange, min = 0, max = 100, step = 1, unit = "" }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)]">
          {icon && <span className="h-3.5 w-3.5">{icon}</span>}
          {label}
        </label>
        <span className="text-xs font-medium text-[oklch(0.2200_0.015_20)]">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-[oklch(0.9600_0.008_30)] rounded-lg appearance-none cursor-pointer accent-[oklch(0.6500_0.22_25)]"
      />
    </div>
  );
}

function ToggleField({ label, icon, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between">
      <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)]">
        {icon && <span className="h-3.5 w-3.5">{icon}</span>}
        {label}
      </label>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? "bg-[oklch(0.6500_0.22_25)]" : "bg-[oklch(0.9200_0.005_20)]"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function SelectField({ label, icon, value, onChange, options }: any) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
        {icon && <span className="h-3.5 w-3.5">{icon}</span>}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function IconButtonGroup({ options, value, onChange }: any) {
  return (
    <div className="flex items-center gap-1 bg-[oklch(0.9600_0.008_30)] rounded-lg p-1">
      {options.map((opt: any) => (
        <Tooltip key={opt.value} content={opt.label}>
          <button
            onClick={() => onChange(opt.value)}
            className={`flex-1 p-2 rounded transition-all ${
              value === opt.value
                ? "bg-white text-[oklch(0.6500_0.22_25)] shadow-sm"
                : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
            }`}
          >
            {opt.icon && <opt.icon className="h-4 w-4 mx-auto" />}
          </button>
        </Tooltip>
      ))}
    </div>
  );
}

function ColorPicker({ label, icon, value, onChange }: any) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
        {icon && <span className="h-3.5 w-3.5">{icon}</span>}
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded-lg border border-[oklch(0.9200_0.005_20)] cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 text-sm font-mono border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

// MetricField with unit dropdown (px, %, vh, vw, etc.)
function MetricField({ label, icon, value, onChange, allowedUnits = ["px", "%", "vh", "vw", "rem", "em"] }: any) {
  // Parse value and unit
  const parseValue = (val: string) => {
    if (!val || typeof val !== 'string') return { num: '', unit: 'px' };
    const match = val.match(/^([\d.]+)(.*)$/);
    if (match) {
      return { num: match[1], unit: match[2] || 'px' };
    }
    return { num: val, unit: 'px' };
  };

  const { num, unit } = parseValue(value || '');
  const currentUnit = allowedUnits.includes(unit) ? unit : 'px';

  const handleNumberChange = (newNum: string) => {
    if (newNum === '') {
      onChange('');
    } else {
      onChange(`${newNum}${currentUnit}`);
    }
  };

  const handleUnitChange = (newUnit: string) => {
    if (num === '') {
      onChange('');
    } else {
      onChange(`${num}${newUnit}`);
    }
  };

  return (
    <div>
      <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
        {icon && <span className="h-3.5 w-3.5">{icon}</span>}
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={num}
          onChange={(e) => handleNumberChange(e.target.value)}
          placeholder="0"
          className="flex-1 px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
        />
        <select
          value={currentUnit}
          onChange={(e) => handleUnitChange(e.target.value)}
          className="px-2 py-2 text-xs border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)] bg-white"
        >
          {allowedUnits.map((u: string) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function RepeaterField({ label, items, onAdd, onRemove, onUpdate, renderItem }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
          {label}
        </label>
        <button
          onClick={onAdd}
          className="p-1.5 text-[oklch(0.6500_0.22_25)] hover:bg-[oklch(0.6500_0.22_25)]/10 rounded transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item: any, index: number) => (
          <div key={index} className="p-3 border border-[oklch(0.9200_0.005_20)] rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[oklch(0.5200_0.015_25)]">Item {index + 1}</span>
              <button
                onClick={() => onRemove(index)}
                className="p-1 text-[oklch(0.5500_0.26_15)] hover:bg-[oklch(0.9600_0.008_30)] rounded transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            {renderItem(item, index, onUpdate)}
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-4 text-sm text-[oklch(0.5200_0.015_25)] border border-dashed border-[oklch(0.9200_0.005_20)] rounded-lg">
            No items. Click + to add.
          </div>
        )}
      </div>
    </div>
  );
}

// Main Content Panel Component
export function ComprehensiveContentPanel({ component }: { component: ComponentData }) {
  const { updateComponent, designPalette, setDesignPalette } = useEditorStore();
  const data = component as any;
  const styles = data.styles || {};

  const updateData = (updates: any) => {
    updateComponent(component.id, { ...component, ...updates } as any);
  };

  const updateStyles = (styleUpdates: any) => {
    updateComponent(component.id, { ...component, styles: { ...styles, ...styleUpdates } } as any);
  };

  // Helper function to convert YouTube/Vimeo URLs to embed format
  const convertVideoUrlToEmbed = (url: string): string => {
    if (!url || typeof url !== 'string') return url;
    
    const trimmedUrl = url.trim();
    
    // If already an embed URL, return as is
    if (trimmedUrl.includes('youtube.com/embed/') || trimmedUrl.includes('vimeo.com/video/')) {
      return trimmedUrl;
    }
    
    // YouTube - extract video ID from various formats
    let videoId: string | null = null;
    
    // Pattern 1: youtube.com/watch?v=VIDEO_ID
    const watchMatch = trimmedUrl.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?vi=)([a-zA-Z0-9_-]{11})/);
    if (watchMatch) {
      videoId = watchMatch[1];
    }
    
    // Pattern 2: youtu.be/VIDEO_ID
    if (!videoId) {
      const shortMatch = trimmedUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (shortMatch) {
        videoId = shortMatch[1];
      }
    }
    
    // Pattern 3: youtube.com/v/VIDEO_ID
    if (!videoId) {
      const vMatch = trimmedUrl.match(/youtube\.com\/v\/([a-zA-Z0-9_-]{11})/);
      if (vMatch) {
        videoId = vMatch[1];
      }
    }
    
    // Pattern 4: Generic pattern
    if (!videoId) {
      const genericMatch = trimmedUrl.match(/(?:youtube\.com\/|youtu\.be\/|m\.youtube\.com\/)(?:watch\?v=|v\/|embed\/|)([a-zA-Z0-9_-]{11})/);
      if (genericMatch) {
        videoId = genericMatch[1];
      }
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo
    const vimeoMatch = trimmedUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    // Return original if we can't parse it
    return trimmedUrl;
  };

  // HEADING Component
  if (component.type === "header") {
    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <InputField
              label="Text"
              icon={<Type className="h-3.5 w-3.5" />}
              type="textarea"
              value={data.content || ""}
              onChange={(v: string) => updateData({ content: v })}
              placeholder="Enter heading text..."
            />
            <SelectField
              label="HTML Tag"
              icon={<Hash className="h-3.5 w-3.5" />}
              value={data.headerLevel || "h2"}
              onChange={(v: string) => updateData({ headerLevel: v })}
              options={[
                { value: "h1", label: "H1 - Largest" },
                { value: "h2", label: "H2 - Large" },
                { value: "h3", label: "H3 - Medium" },
                { value: "h4", label: "H4 - Small" },
                { value: "h5", label: "H5 - Smaller" },
                { value: "h6", label: "H6 - Smallest" },
              ]}
            />
            <ToggleField
              label="Add Link"
              icon={<Link2 className="h-3.5 w-3.5" />}
              checked={data.hasLink || false}
              onChange={(v: boolean) => updateData({ hasLink: v })}
            />
            {data.hasLink && (
              <>
                <InputField
                  label="URL"
                  icon={<Globe className="h-3.5 w-3.5" />}
                  value={data.linkUrl || ""}
                  onChange={(v: string) => updateData({ linkUrl: v })}
                  placeholder="https://..."
                />
                <ToggleField
                  label="Open in New Tab"
                  icon={<ExternalLink className="h-3.5 w-3.5" />}
                  checked={data.openInNewTab || false}
                  onChange={(v: boolean) => updateData({ openInNewTab: v })}
                />
              </>
            )}
          </div>
        ),
      },
      {
        id: "layout",
        label: "Layout",
        icon: <Layout className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
                <AlignLeft className="h-3.5 w-3.5" />
                Alignment
              </label>
              <IconButtonGroup
                options={[
                  { value: "left", icon: AlignLeft, label: "Left" },
                  { value: "center", icon: AlignCenter, label: "Center" },
                  { value: "right", icon: AlignRight, label: "Right" },
                ]}
                value={data.alignment || "left"}
                onChange={(v: string) => updateData({ alignment: v })}
              />
            </div>
            <MetricField
              label="Width"
              icon={<Maximize className="h-3.5 w-3.5" />}
              value={styles.width || ""}
              onChange={(v: string) => updateStyles({ width: v })}
              allowedUnits={["px", "%", "vw", "rem", "em"]}
            />
            <div className="grid grid-cols-2 gap-2">
              <InputField
                label="Margin"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.margin || ""}
                onChange={(v: string) => updateStyles({ margin: v })}
                placeholder="0"
              />
              <InputField
                label="Padding"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.padding || ""}
                onChange={(v: string) => updateStyles({ padding: v })}
                placeholder="0"
              />
            </div>
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <SliderField
              label="Font Size"
              icon={<Type className="h-3.5 w-3.5" />}
              value={parseFloat(data.fontSize?.replace("rem", "") || "2") * 16}
              onChange={(v: number) => updateData({ fontSize: `${v / 16}rem` })}
              min={12}
              max={96}
              step={1}
              unit="px"
            />
            <SelectField
              label="Weight"
              icon={<Bold className="h-3.5 w-3.5" />}
              value={data.fontWeight || "700"}
              onChange={(v: string) => updateData({ fontWeight: v })}
              options={[
                { value: "400", label: "Regular" },
                { value: "500", label: "Medium" },
                { value: "600", label: "Semi Bold" },
                { value: "700", label: "Bold" },
                { value: "800", label: "Extra Bold" },
              ]}
            />
            <SliderField
              label="Line Height"
              icon={<ArrowUp className="h-3.5 w-3.5" />}
              value={parseFloat(data.lineHeight || "1.5") * 100}
              onChange={(v: number) => updateData({ lineHeight: `${v / 100}` })}
              min={100}
              max={300}
              step={5}
              unit="%"
            />
            <SliderField
              label="Letter Spacing"
              icon={<Type className="h-3.5 w-3.5" />}
              value={parseFloat(data.letterSpacing?.replace("em", "") || "0") * 100}
              onChange={(v: number) => updateData({ letterSpacing: `${v / 100}em` })}
              min={-50}
              max={200}
              step={1}
              unit="%"
            />
            <ColorPicker
              label="Color"
              icon={<Palette className="h-3.5 w-3.5" />}
              value={styles.color || designPalette.titleColor}
              onChange={(v: string) => updateStyles({ color: v })}
            />
            <SelectField
              label="Text Transform"
              icon={<ArrowUp className="h-3.5 w-3.5" />}
              value={styles.textTransform || "none"}
              onChange={(v: string) => updateStyles({ textTransform: v })}
              options={[
                { value: "none", label: "None" },
                { value: "uppercase", label: "Uppercase" },
                { value: "lowercase", label: "Lowercase" },
                { value: "capitalize", label: "Capitalize" },
              ]}
            />
          </div>
        ),
      },
      {
        id: "advanced",
        label: "Advanced",
        icon: <Settings className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <SelectField
              label="Animation on Scroll"
              icon={<Sparkles className="h-3.5 w-3.5" />}
              value={data.animation || "none"}
              onChange={(v: string) => updateData({ animation: v })}
              options={[
                { value: "none", label: "None" },
                { value: "fade", label: "Fade In" },
                { value: "slide-up", label: "Slide Up" },
                { value: "slide-down", label: "Slide Down" },
              ]}
            />
            <InputField
              label="Custom CSS"
              icon={<Code className="h-3.5 w-3.5" />}
              type="textarea"
              value={data.customCSS || ""}
              onChange={(v: string) => updateData({ customCSS: v })}
              placeholder=".custom-class { ... }"
            />
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // TEXT/PARAGRAPH Component
  if (component.type === "text") {
    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <InputField
              label="Text"
              icon={<Type className="h-3.5 w-3.5" />}
              type="textarea"
              value={data.content || ""}
              onChange={(v: string) => updateData({ content: v })}
              placeholder="Enter your text here..."
              rows={6}
            />
            <ToggleField
              label="Rich Text Editor"
              icon={<Bold className="h-3.5 w-3.5" />}
              checked={data.richText || false}
              onChange={(v: boolean) => updateData({ richText: v })}
            />
          </div>
        ),
      },
      {
        id: "layout",
        label: "Layout",
        icon: <Layout className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
                <AlignLeft className="h-3.5 w-3.5" />
                Alignment
              </label>
              <IconButtonGroup
                options={[
                  { value: "left", icon: AlignLeft, label: "Left" },
                  { value: "center", icon: AlignCenter, label: "Center" },
                  { value: "right", icon: AlignRight, label: "Right" },
                ]}
                value={data.alignment || "left"}
                onChange={(v: string) => updateData({ alignment: v })}
              />
            </div>
            <MetricField
              label="Width"
              icon={<Maximize className="h-3.5 w-3.5" />}
              value={styles.width || ""}
              onChange={(v: string) => updateStyles({ width: v })}
              allowedUnits={["px", "%", "vw", "rem", "em"]}
            />
            <div className="grid grid-cols-2 gap-2">
              <InputField
                label="Margin"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.margin || ""}
                onChange={(v: string) => updateStyles({ margin: v })}
                placeholder="0"
              />
              <InputField
                label="Padding"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.padding || ""}
                onChange={(v: string) => updateStyles({ padding: v })}
                placeholder="0"
              />
            </div>
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <SliderField
              label="Font Size"
              icon={<Type className="h-3.5 w-3.5" />}
              value={parseFloat(data.fontSize?.replace("px", "") || "16")}
              onChange={(v: number) => updateData({ fontSize: `${v}px` })}
              min={10}
              max={48}
              step={1}
              unit="px"
            />
            <SelectField
              label="Weight"
              icon={<Bold className="h-3.5 w-3.5" />}
              value={data.fontWeight || "400"}
              onChange={(v: string) => updateData({ fontWeight: v })}
              options={[
                { value: "300", label: "Light" },
                { value: "400", label: "Regular" },
                { value: "500", label: "Medium" },
                { value: "600", label: "Semi Bold" },
                { value: "700", label: "Bold" },
              ]}
            />
            <ColorPicker
              label="Color"
              icon={<Palette className="h-3.5 w-3.5" />}
              value={styles.color || designPalette.descriptionColor}
              onChange={(v: string) => updateStyles({ color: v })}
            />
            <SliderField
              label="Line Height"
              icon={<ArrowUp className="h-3.5 w-3.5" />}
              value={parseFloat(data.lineHeight || "1.6") * 100}
              onChange={(v: number) => updateData({ lineHeight: `${v / 100}` })}
              min={100}
              max={300}
              step={5}
              unit="%"
            />
            <SliderField
              label="Max Width"
              icon={<Maximize className="h-3.5 w-3.5" />}
              value={parseFloat(styles.maxWidth?.replace("px", "") || "700")}
              onChange={(v: number) => updateStyles({ maxWidth: `${v}px` })}
              min={300}
              max={1200}
              step={50}
              unit="px"
            />
          </div>
        ),
      },
      {
        id: "advanced",
        label: "Advanced",
        icon: <Settings className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <SelectField
              label="Animation"
              icon={<Sparkles className="h-3.5 w-3.5" />}
              value={data.animation || "none"}
              onChange={(v: string) => updateData({ animation: v })}
              options={[
                { value: "none", label: "None" },
                { value: "fade", label: "Fade In" },
                { value: "slide", label: "Slide" },
              ]}
            />
            <div>
              <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
                <Monitor className="h-3.5 w-3.5" />
                Visibility
              </label>
              <div className="space-y-2">
                <ToggleField
                  label="Desktop"
                  checked={data.visibility?.desktop !== false}
                  onChange={(v: boolean) => updateData({ visibility: { ...data.visibility, desktop: v } })}
                />
                <ToggleField
                  label="Tablet"
                  checked={data.visibility?.tablet !== false}
                  onChange={(v: boolean) => updateData({ visibility: { ...data.visibility, tablet: v } })}
                />
                <ToggleField
                  label="Mobile"
                  checked={data.visibility?.mobile !== false}
                  onChange={(v: boolean) => updateData({ visibility: { ...data.visibility, mobile: v } })}
                />
              </div>
            </div>
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // BUTTON Component
  if (component.type === "button") {
    const buttons = data.buttons || [{ text: "", link: "", variant: "default" }];
    const button = buttons[0] || { text: "", link: "", variant: "default" };
    const displayMode = button.displayMode || (button.hasIcon ? "both" : "text");
    const iconPlacement = button.iconPlacement || button.iconPosition || "left";
    const resolvedWidth = button.width || styles.width || "";
    const resolvedHeight = button.height || styles.height || "";
    const heightValue = parseFloat(resolvedHeight?.replace("px", "") || "44");

    const applyButtonUpdate = (updates: Partial<typeof button>) => {
      const newButtons = [{ ...button, ...updates }];
      updateData({ buttons: newButtons });
    };

    const handleIconUpload = (file?: File | null) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        applyButtonUpdate({ customIcon: reader.result as string });
      };
      reader.readAsDataURL(file);
    };

    const buttonIconOptions = [
      { value: "arrow-right", label: "Arrow Right" },
      { value: "search", label: "Search" },
      { value: "mail", label: "Mail" },
      { value: "phone", label: "Phone" },
      { value: "globe", label: "Globe" },
      { value: "map-pin", label: "Location" },
      { value: "calendar", label: "Calendar" },
      { value: "github", label: "GitHub" },
      { value: "twitter", label: "Twitter" },
      { value: "linkedin", label: "LinkedIn" },
      { value: "instagram", label: "Instagram" },
      { value: "facebook", label: "Facebook" },
      { value: "youtube", label: "YouTube" },
      { value: "zap", label: "Spark" },
      { value: "star", label: "Star" },
      { value: "heart", label: "Heart" },
      { value: "download", label: "Download" },
      { value: "external-link", label: "External Link" },
    ];
    
    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <InputField
              label="Button Label"
              icon={<Type className="h-3.5 w-3.5" />}
              value={button.text || ""}
              onChange={(v: string) => applyButtonUpdate({ text: v })}
              placeholder="Click me"
            />
            <InputField
              label="Link URL"
              icon={<Link2 className="h-3.5 w-3.5" />}
              value={button.link || ""}
              onChange={(v: string) => applyButtonUpdate({ link: v })}
              placeholder="https://..."
            />
            <ToggleField
              label="Open in New Tab"
              icon={<ExternalLink className="h-3.5 w-3.5" />}
              checked={button.openInNewTab || false}
              onChange={(v: boolean) => applyButtonUpdate({ openInNewTab: v })}
            />
            <SelectField
              label="Content Mode"
              icon={<Layout className="h-3.5 w-3.5" />}
              value={displayMode}
              onChange={(v: string) =>
                applyButtonUpdate({
                  displayMode: v as "text" | "icon" | "both",
                  hasIcon: v !== "text",
                })
              }
              options={[
                { value: "text", label: "Text only" },
                { value: "icon", label: "Icon only" },
                { value: "both", label: "Icon + Text" },
              ]}
            />
            {displayMode !== "text" && (
              <>
                <SelectField
                  label="Icon Placement"
                  icon={<Layout className="h-3.5 w-3.5" />}
                  value={iconPlacement}
                  onChange={(v: string) =>
                    applyButtonUpdate({
                      iconPlacement: v as "left" | "right",
                      iconPosition: v as "left" | "right",
                    })
                  }
                  options={[
                    { value: "left", label: "Left" },
                    { value: "right", label: "Right" },
                  ]}
                />
                <SelectField
                  label="Default Icon"
                  icon={<Zap className="h-3.5 w-3.5" />}
                  value={button.icon || "arrow-right"}
                  onChange={(v: string) => applyButtonUpdate({ icon: v })}
                  options={buttonIconOptions}
                />
                <ColorPicker
                  label="Icon Color"
                  icon={<Palette className="h-3.5 w-3.5" />}
                  value={button.iconColor || "#0f172a"}
                  onChange={(v: string) => applyButtonUpdate({ iconColor: v })}
                />
                <div>
                  <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
                    <Upload className="h-3.5 w-3.5" />
                    Custom Icon (SVG/PNG)
                  </label>
                  {button.customIcon && (
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={button.customIcon}
                        alt="Button icon"
                        className="h-6 w-6 rounded border border-[oklch(0.9200_0.005_20)] object-contain"
                      />
                      <button
                        className="text-xs text-[oklch(0.5500_0.26_15)] hover:underline"
                        onClick={() => applyButtonUpdate({ customIcon: undefined })}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".svg,image/svg+xml,image/png,image/jpeg"
                    onChange={(e) => handleIconUpload(e.target.files?.[0])}
                    className="w-full text-xs text-[oklch(0.5200_0.015_25)]"
                  />
                </div>
              </>
            )}
          </div>
        ),
      },
      {
        id: "layout",
        label: "Layout",
        icon: <Layout className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <InputField
              label="Button Width"
              icon={<Maximize className="h-3.5 w-3.5" />}
              value={resolvedWidth}
              onChange={(v: string) => {
                applyButtonUpdate({ width: v || undefined });
                if (!v) updateStyles({ width: undefined });
              }}
              placeholder="e.g. 220px or 100%"
            />
            <SliderField
              label="Height"
              icon={<Ruler className="h-3.5 w-3.5" />}
              value={heightValue}
              onChange={(v: number) => applyButtonUpdate({ height: `${v}px` })}
              min={32}
              max={96}
              step={2}
              unit="px"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                label="Padding X"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={button.paddingX || ""}
                onChange={(v: string) => applyButtonUpdate({ paddingX: v || undefined })}
                placeholder="e.g. 1.5rem"
              />
              <InputField
                label="Padding Y"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={button.paddingY || ""}
                onChange={(v: string) => applyButtonUpdate({ paddingY: v || undefined })}
                placeholder="e.g. 0.75rem"
              />
            </div>
            <SelectField
              label="Content Alignment"
              icon={<AlignCenter className="h-3.5 w-3.5" />}
              value={button.contentAlign || "center"}
              onChange={(v: string) => applyButtonUpdate({ contentAlign: v as "left" | "center" | "right" })}
              options={[
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ]}
            />
            <SelectField
              label="Button Group Alignment"
              icon={<AlignLeft className="h-3.5 w-3.5" />}
              value={data.alignment || "left"}
              onChange={(v: string) => updateData({ alignment: v })}
              options={[
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ]}
            />
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <SelectField
              label="Style Preset"
              icon={<Palette className="h-3.5 w-3.5" />}
              value={button.variant || "default"}
              onChange={(v: string) => {
                const newButtons = [{ ...button, variant: v }];
                updateData({ buttons: newButtons });
              }}
              options={[
                { value: "default", label: "Solid" },
                { value: "outline", label: "Outline" },
                { value: "ghost", label: "Ghost" },
              ]}
            />
            <ColorPicker
              label="Background Color"
              icon={<Palette className="h-3.5 w-3.5" />}
              value={styles.backgroundColor || designPalette.primaryColor}
              onChange={(v: string) => updateStyles({ backgroundColor: v })}
            />
            <ColorPicker
              label="Text Color"
              icon={<Type className="h-3.5 w-3.5" />}
              value={styles.color || "#ffffff"}
              onChange={(v: string) => updateStyles({ color: v })}
            />
            <SliderField
              label="Border Radius"
              icon={<Maximize className="h-3.5 w-3.5" />}
              value={parseFloat(styles.borderRadius?.replace("px", "") || designPalette.borderRadius?.replace("rem", "") || "8") * 4}
              onChange={(v: number) => updateStyles({ borderRadius: `${v / 4}px` })}
              min={0}
              max={40}
              step={1}
              unit="px"
            />
            <SelectField
              label="Shadow"
              icon={<Layers className="h-3.5 w-3.5" />}
              value={styles.boxShadow || "none"}
              onChange={(v: string) => updateStyles({ boxShadow: v })}
              options={[
                { value: "none", label: "None" },
                { value: "sm", label: "Small" },
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
              ]}
            />
            <SelectField
              label="Hover Effect"
              icon={<Sparkles className="h-3.5 w-3.5" />}
              value={data.hoverEffect || "none"}
              onChange={(v: string) => updateData({ hoverEffect: v })}
              options={[
                { value: "none", label: "None" },
                { value: "lift", label: "Lift" },
                { value: "glow", label: "Glow" },
                { value: "scale", label: "Scale" },
              ]}
            />
          </div>
        ),
      },
      {
        id: "advanced",
        label: "Advanced",
        icon: <Settings className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <SelectField
              label="Button Click Action"
              icon={<Zap className="h-3.5 w-3.5" />}
              value={data.clickAction || "open-url"}
              onChange={(v: string) => updateData({ clickAction: v })}
              options={[
                { value: "open-url", label: "Open URL" },
                { value: "scroll-to", label: "Scroll to Section" },
                { value: "run-script", label: "Run Script" },
              ]}
            />
            {data.clickAction === "scroll-to" && (
              <InputField
                label="Section ID"
                icon={<Hash className="h-3.5 w-3.5" />}
                value={data.scrollToId || ""}
                onChange={(v: string) => updateData({ scrollToId: v })}
                placeholder="#section-id"
              />
            )}
            {data.clickAction === "run-script" && (
              <InputField
                label="JavaScript Code"
                icon={<Code className="h-3.5 w-3.5" />}
                type="textarea"
                value={data.scriptCode || ""}
                onChange={(v: string) => updateData({ scriptCode: v })}
                placeholder="console.log('clicked');"
              />
            )}
            <InputField
              label="Custom CSS"
              icon={<Code className="h-3.5 w-3.5" />}
              type="textarea"
              value={data.customCSS || ""}
              onChange={(v: string) => updateData({ customCSS: v })}
              placeholder=".custom-class { ... }"
            />
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // IMAGE Component
  if (component.type === "image") {
    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64String = reader.result as string;
                      updateData({ src: base64String });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
                id={`image-upload-${component.id}`}
              />
              <label
                htmlFor={`image-upload-${component.id}`}
                className="w-full px-4 py-2 text-sm font-medium bg-[oklch(0.6500_0.22_25)] text-white rounded hover:bg-[oklch(0.6500_0.22_25)]/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                {data.src ? "Replace Image" : "Upload Image"}
              </label>
            </div>
            {data.src && (
              <div className="w-full h-32 border border-[oklch(0.9200_0.005_20)] rounded-lg overflow-hidden bg-[oklch(0.9600_0.008_30)] flex items-center justify-center">
                <img src={data.src} alt={data.alt || ""} className="max-w-full max-h-full object-contain" />
              </div>
            )}
            <InputField
              label="Image URL"
              icon={<Globe className="h-3.5 w-3.5" />}
              value={data.src || ""}
              onChange={(v: string) => updateData({ src: v })}
              placeholder="https://example.com/image.jpg"
            />
            <InputField
              label="Alt Text"
              icon={<ImageIcon className="h-3.5 w-3.5" />}
              value={data.alt || ""}
              onChange={(v: string) => updateData({ alt: v })}
              placeholder="Image description"
            />
            <ToggleField
              label="Link on Image"
              icon={<Link2 className="h-3.5 w-3.5" />}
              checked={data.hasLink || false}
              onChange={(v: boolean) => updateData({ hasLink: v })}
            />
            {data.hasLink && (
              <InputField
                label="Link URL"
                icon={<Globe className="h-3.5 w-3.5" />}
                value={data.linkUrl || ""}
                onChange={(v: string) => updateData({ linkUrl: v })}
                placeholder="https://..."
              />
            )}
          </div>
        ),
      },
      {
        id: "layout",
        label: "Layout",
        icon: <Layout className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <InputField
                label="Width"
                icon={<Maximize className="h-3.5 w-3.5" />}
                value={styles.width || ""}
                onChange={(v: string) => updateStyles({ width: v })}
                placeholder="auto / 100% / 500px"
              />
              <MetricField
                label="Height"
                icon={<Ruler className="h-3.5 w-3.5" />}
                value={styles.height || ""}
                onChange={(v: string) => updateStyles({ height: v })}
                allowedUnits={["px", "%", "vh", "rem", "em"]}
              />
            </div>
            <SelectField
              label="Fit Mode"
              icon={<Maximize2 className="h-3.5 w-3.5" />}
              value={data.fitMode || "contain"}
              onChange={(v: string) => updateData({ fitMode: v })}
              options={[
                { value: "cover", label: "Cover" },
                { value: "contain", label: "Contain" },
                { value: "fill", label: "Fill" },
              ]}
            />
            <div>
              <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
                <AlignLeft className="h-3.5 w-3.5" />
                Alignment
              </label>
              <IconButtonGroup
                options={[
                  { value: "left", icon: AlignLeft, label: "Left" },
                  { value: "center", icon: AlignCenter, label: "Center" },
                  { value: "right", icon: AlignRight, label: "Right" },
                ]}
                value={data.alignment || "left"}
                onChange={(v: string) => updateData({ alignment: v })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <InputField
                label="Margin"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.margin || ""}
                onChange={(v: string) => updateStyles({ margin: v })}
                placeholder="0"
              />
              <InputField
                label="Padding"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.padding || ""}
                onChange={(v: string) => updateStyles({ padding: v })}
                placeholder="0"
              />
            </div>
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <SliderField
              label="Border Radius"
              icon={<Maximize className="h-3.5 w-3.5" />}
              value={parseFloat(styles.borderRadius?.replace("px", "") || "0")}
              onChange={(v: number) => updateStyles({ borderRadius: `${v}px` })}
              min={0}
              max={50}
              step={1}
              unit="px"
            />
            <div className="grid grid-cols-2 gap-2">
              <InputField
                label="Border Width"
                icon={<Minus className="h-3.5 w-3.5" />}
                value={styles.borderWidth || ""}
                onChange={(v: string) => updateStyles({ borderWidth: v })}
                placeholder="0px"
              />
              <ColorPicker
                label="Border Color"
                icon={<Palette className="h-3.5 w-3.5" />}
                value={styles.borderColor || "#000000"}
                onChange={(v: string) => updateStyles({ borderColor: v })}
              />
            </div>
            <SliderField
              label="Drop Shadow"
              icon={<Layers className="h-3.5 w-3.5" />}
              value={parseFloat(data.shadow || "0")}
              onChange={(v: number) => updateData({ shadow: `${v}` })}
              min={0}
              max={50}
              step={1}
              unit="px"
            />
            <ToggleField
              label="Hover Zoom"
              icon={<Maximize2 className="h-3.5 w-3.5" />}
              checked={data.hoverZoom || false}
              onChange={(v: boolean) => updateData({ hoverZoom: v })}
            />
          </div>
        ),
      },
      {
        id: "advanced",
        label: "Advanced",
        icon: <Settings className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <ToggleField
              label="Lazy Load"
              icon={<Eye className="h-3.5 w-3.5" />}
              checked={data.lazyLoad || false}
              onChange={(v: boolean) => updateData({ lazyLoad: v })}
            />
            <InputField
              label="Custom Attributes"
              icon={<Code className="h-3.5 w-3.5" />}
              type="textarea"
              value={data.customAttributes || ""}
              onChange={(v: string) => updateData({ customAttributes: v })}
              placeholder='data-custom="value"'
            />
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // VIDEO Component
  if (component.type === "video") {
    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <SelectField
              label="Source"
              icon={<Video className="h-3.5 w-3.5" />}
              value={(() => {
                // Auto-detect source from URL if not set
                if (data.embedUrl) {
                  if (/youtube\.com|youtu\.be/i.test(data.embedUrl)) {
                    return "youtube";
                  }
                  if (/vimeo\.com/i.test(data.embedUrl)) {
                    return "vimeo";
                  }
                }
                return data.source || "youtube";
              })()}
              onChange={(v: string) => updateData({ source: v })}
              options={[
                { value: "youtube", label: "YouTube" },
                { value: "vimeo", label: "Vimeo" },
                { value: "upload", label: "Upload" },
                { value: "url", label: "URL" },
              ]}
            />
            {data.source === "youtube" || data.source === "vimeo" ? (
              <>
                <InputField
                  label="Video URL"
                  icon={<Globe className="h-3.5 w-3.5" />}
                  value={data.embedUrl || ""}
                  onChange={(v: string) => {
                    // Auto-detect and set source type based on URL
                    const isYouTube = /youtube\.com|youtu\.be/i.test(v);
                    const isVimeo = /vimeo\.com/i.test(v);
                    
                    if (isYouTube) {
                      updateData({ source: "youtube", embedUrl: v });
                    } else if (isVimeo) {
                      updateData({ source: "vimeo", embedUrl: v });
                    } else {
                      // Store the original URL - the Video component will convert it on render
                      updateData({ embedUrl: v });
                    }
                  }}
                  placeholder="Paste YouTube or Vimeo URL here (e.g., https://youtube.com/watch?v=...)"
                />
                {data.embedUrl && (
                  <div className="p-2 bg-[oklch(0.9600_0.008_30)] rounded text-xs text-[oklch(0.5200_0.015_25)]">
                    ✓ URL detected. Video will be embedded automatically.
                  </div>
                )}
              </>
            ) : data.source === "upload" ? (
              <div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64String = reader.result as string;
                        updateData({ videoUrl: base64String });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                  id={`video-upload-${component.id}`}
                />
                <label
                  htmlFor={`video-upload-${component.id}`}
                  className="w-full px-4 py-2 text-sm font-medium bg-[oklch(0.6500_0.22_25)] text-white rounded hover:bg-[oklch(0.6500_0.22_25)]/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  Upload Video
                </label>
              </div>
            ) : (
              <InputField
                label="Video URL"
                icon={<Globe className="h-3.5 w-3.5" />}
                value={data.videoUrl || ""}
                onChange={(v: string) => updateData({ videoUrl: v })}
                placeholder="https://..."
              />
            )}
            <InputField
              label="Title"
              icon={<Type className="h-3.5 w-3.5" />}
              value={data.title || ""}
              onChange={(v: string) => updateData({ title: v })}
              placeholder="Video title"
            />
            <div className="space-y-2">
              <ToggleField
                label="Autoplay"
                icon={<Play className="h-3.5 w-3.5" />}
                checked={data.autoplay || false}
                onChange={(v: boolean) => updateData({ autoplay: v })}
              />
              <ToggleField
                label="Mute"
                icon={<VolumeX className="h-3.5 w-3.5" />}
                checked={data.mute || false}
                onChange={(v: boolean) => updateData({ mute: v })}
              />
              <ToggleField
                label="Loop"
                icon={<Repeat className="h-3.5 w-3.5" />}
                checked={data.loop || false}
                onChange={(v: boolean) => updateData({ loop: v })}
              />
              <ToggleField
                label="Show Controls"
                icon={<Settings className="h-3.5 w-3.5" />}
                checked={data.showControls !== false}
                onChange={(v: boolean) => updateData({ showControls: v })}
              />
            </div>
          </div>
        ),
      },
      {
        id: "layout",
        label: "Layout",
        icon: <Layout className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <InputField
                label="Width"
                icon={<Maximize className="h-3.5 w-3.5" />}
                value={styles.width || ""}
                onChange={(v: string) => updateStyles({ width: v })}
                placeholder="100%"
              />
              <InputField
                label="Height"
                icon={<Ruler className="h-3.5 w-3.5" />}
                value={styles.height || ""}
                onChange={(v: string) => updateStyles({ height: v })}
                placeholder="auto"
              />
            </div>
            <SelectField
              label="Aspect Ratio"
              icon={<Maximize2 className="h-3.5 w-3.5" />}
              value={data.aspectRatio || "16:9"}
              onChange={(v: string) => updateData({ aspectRatio: v })}
              options={[
                { value: "16:9", label: "16:9" },
                { value: "4:3", label: "4:3" },
                { value: "1:1", label: "1:1" },
                { value: "auto", label: "Auto" },
              ]}
            />
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <SliderField
              label="Corner Radius"
              icon={<Maximize className="h-3.5 w-3.5" />}
              value={parseFloat(styles.borderRadius?.replace("px", "") || "0")}
              onChange={(v: number) => updateStyles({ borderRadius: `${v}px` })}
              min={0}
              max={50}
              step={1}
              unit="px"
            />
            <SliderField
              label="Shadow"
              icon={<Layers className="h-3.5 w-3.5" />}
              value={parseFloat(data.shadow || "0")}
              onChange={(v: number) => updateData({ shadow: `${v}` })}
              min={0}
              max={50}
              step={1}
              unit="px"
            />
          </div>
        ),
      },
      {
        id: "advanced",
        label: "Advanced",
        icon: <Settings className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <ToggleField
              label="Lazy Load"
              icon={<Eye className="h-3.5 w-3.5" />}
              checked={data.lazyLoad || false}
              onChange={(v: boolean) => updateData({ lazyLoad: v })}
            />
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // GALLERY Component
  if (component.type === "gallery") {
    const galleryData = data as any;
    const images = galleryData.images || [];
    const maxImages = galleryData.maxImages || 20;
    
    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <ImageIcon className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)]">
                <ImageIcon className="h-3.5 w-3.5" />
                Images ({images.length}/{maxImages})
              </label>
              {images.length < maxImages && (
                <label
                  htmlFor={`gallery-upload-${component.id}`}
                  className="px-3 py-1.5 text-xs font-medium bg-[oklch(0.6500_0.22_25)] text-white rounded hover:bg-[oklch(0.6500_0.22_25)]/90 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Add Images
                </label>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length === 0) return;
                
                const remainingSlots = maxImages - images.length;
                const filesToAdd = files.slice(0, remainingSlots);
                
                Promise.all(
                  filesToAdd.map((file) => {
                    return new Promise<{ src: string; alt: string }>((resolve) => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        resolve({
                          src: reader.result as string,
                          alt: file.name,
                        });
                      };
                      reader.readAsDataURL(file);
                    });
                  })
                ).then((newImages) => {
                  updateData({ images: [...images, ...newImages] });
                });
              }}
              className="hidden"
              id={`gallery-upload-${component.id}`}
            />
            
            {images.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-[oklch(0.9200_0.005_20)] rounded-lg text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-[oklch(0.5200_0.015_25)]" />
                <p className="text-sm text-[oklch(0.5200_0.015_25)]">No images added yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img: any, index: number) => (
                  <div key={index} className="relative group aspect-square rounded overflow-hidden border border-[oklch(0.9200_0.005_20)]">
                    <img
                      src={img.src}
                      alt={img.alt || `Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        const newImages = images.filter((_: any, i: number) => i !== index);
                        updateData({ images: newImages });
                      }}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <InputField
              label="Max Images"
              icon={<Maximize className="h-3.5 w-3.5" />}
              type="number"
              value={maxImages.toString()}
              onChange={(v: string) => updateData({ maxImages: parseInt(v) || 20 })}
              placeholder="20"
            />
          </div>
        ),
      },
      {
        id: "layout",
        label: "Layout",
        icon: <Layout className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <SelectField
              label="Display Mode"
              icon={<Grid3x3 className="h-3.5 w-3.5" />}
              value={galleryData.mode || "grid"}
              onChange={(v: string) => updateData({ mode: v })}
              options={[
                { value: "grid", label: "Grid" },
                { value: "marquee", label: "Marquee" },
                { value: "carousel", label: "Carousel" },
              ]}
            />
            
            {galleryData.mode === "grid" && (
              <SelectField
                label="Columns"
                icon={<Grid3x3 className="h-3.5 w-3.5" />}
                value={(galleryData.columns || 3).toString()}
                onChange={(v: string) => updateData({ columns: parseInt(v) as 2 | 3 | 4 | 5 | 6 })}
                options={[
                  { value: "2", label: "2 Columns" },
                  { value: "3", label: "3 Columns" },
                  { value: "4", label: "4 Columns" },
                  { value: "5", label: "5 Columns" },
                  { value: "6", label: "6 Columns" },
                ]}
              />
            )}
            
            {(galleryData.mode === "marquee" || galleryData.mode === "carousel") && (
              <SelectField
                label="Direction"
                icon={<ArrowRight className="h-3.5 w-3.5" />}
                value={galleryData.direction || "left"}
                onChange={(v: string) => updateData({ direction: v })}
                options={[
                  { value: "left", label: "Left to Right" },
                  { value: "right", label: "Right to Left" },
                ]}
              />
            )}
            
            <SelectField
              label="Aspect Ratio"
              icon={<Maximize2 className="h-3.5 w-3.5" />}
              value={galleryData.aspectRatio || "1:1"}
              onChange={(v: string) => updateData({ aspectRatio: v })}
              options={[
                { value: "1:1", label: "1:1 (Square)" },
                { value: "16:9", label: "16:9 (Widescreen)" },
                { value: "4:3", label: "4:3 (Standard)" },
                { value: "3:2", label: "3:2 (Photo)" },
                { value: "auto", label: "Auto" },
              ]}
            />
            
            <SliderField
              label="Spacing"
              icon={<Layers className="h-3.5 w-3.5" />}
              value={parseFloat((galleryData.spacing || "12").toString().replace("px", "").replace("rem", ""))}
              onChange={(v: number) => updateData({ spacing: `${v}px` })}
              min={0}
              max={48}
              step={2}
              unit="px"
            />
            
            {(galleryData.mode === "marquee" || galleryData.mode === "carousel") && (
              <SliderField
                label="Animation Speed"
                icon={<Sparkles className="h-3.5 w-3.5" />}
                value={galleryData.speed || 30}
                onChange={(v: number) => updateData({ speed: v })}
                min={5}
                max={60}
                step={5}
                unit="s"
              />
            )}
            
            {galleryData.mode === "carousel" && (
              <>
                <SliderField
                  label="Images to Show"
                  icon={<Grid3x3 className="h-3.5 w-3.5" />}
                  value={galleryData.carouselImagesToShow || 1}
                  onChange={(v: number) => updateData({ carouselImagesToShow: v })}
                  min={1}
                  max={Math.min(images.length || 1, 5)}
                  step={1}
                  unit=""
                />
                <ToggleField
                  label="Move Full Slide"
                  icon={<Maximize className="h-3.5 w-3.5" />}
                  checked={galleryData.carouselMoveFull !== false}
                  onChange={(v: boolean) => updateData({ carouselMoveFull: v })}
                />
                {galleryData.carouselMoveFull === false && (
                  <SliderField
                    label="Move By (Pixels)"
                    icon={<Ruler className="h-3.5 w-3.5" />}
                    value={galleryData.carouselMoveByPx || 100}
                    onChange={(v: number) => updateData({ carouselMoveByPx: v })}
                    min={50}
                    max={500}
                    step={50}
                    unit="px"
                  />
                )}
                <ToggleField
                  label="Auto Play"
                  icon={<Play className="h-3.5 w-3.5" />}
                  checked={galleryData.carouselAutoPlay !== false}
                  onChange={(v: boolean) => updateData({ carouselAutoPlay: v })}
                />
              </>
            )}
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <SliderField
              label="Corner Radius"
              icon={<Maximize className="h-3.5 w-3.5" />}
              value={parseFloat(styles.borderRadius?.replace("px", "") || "0")}
              onChange={(v: number) => updateStyles({ borderRadius: `${v}px` })}
              min={0}
              max={50}
              step={1}
              unit="px"
            />
            <SliderField
              label="Shadow"
              icon={<Layers className="h-3.5 w-3.5" />}
              value={parseFloat(data.shadow || "0")}
              onChange={(v: number) => updateData({ shadow: `${v}` })}
              min={0}
              max={50}
              step={1}
              unit="px"
            />
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // Continue with other components - returning null for now to use old ContentPanel
  // Navigation component
  if (component.type === "navigation") {
    const navData = component as NavigationComponentData;
    const menuItems = navData.menuItems || [];

    const applyNavUpdate = (updates: Partial<NavigationComponentData>) =>
      updateComponent(component.id, { ...(component as any), ...updates } as any);

    const updateMenuItems = (items: NavigationComponentData["menuItems"]) =>
      applyNavUpdate({ menuItems: items });

    const handleMenuItemChange = (
      id: string,
      field: keyof NavigationComponentData["menuItems"][number],
      value: string
    ) => {
      updateMenuItems(
        menuItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      );
    };

    const addMenuItem = () => {
      if (menuItems.length >= 4) return;
      updateMenuItems([
        ...menuItems,
        {
          id: `${component.id}-item-${Date.now()}`,
          label: "Menu",
          targetType: "page",
          targetValue: "#",
        },
      ]);
    };

    const removeMenuItem = (id: string) =>
      updateMenuItems(menuItems.filter((item) => item.id !== id));

    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <SelectField
              label="Variant"
              icon={<Layout className="h-3.5 w-3.5" />}
              value={navData.variant}
              onChange={(v: string) =>
                applyNavUpdate({ variant: v as NavigationComponentData["variant"] })
              }
              options={[
                { value: "logo-text", label: "Logo + Text" },
                { value: "logo-only", label: "Logo Only" },
                { value: "text-only", label: "Text Only" },
              ]}
            />
            <InputField
              label="Brand Text"
              icon={<Type className="h-3.5 w-3.5" />}
              value={navData.brandText}
              onChange={(v: string) => applyNavUpdate({ brandText: v })}
              placeholder="Studio"
            />
            <InputField
              label="Tagline"
              icon={<Type className="h-3.5 w-3.5" />}
              value={navData.tagline || ""}
              onChange={(v: string) => applyNavUpdate({ tagline: v })}
              placeholder="Premium designer"
            />
            <div>
              <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
                <ImageIcon className="h-3.5 w-3.5" />
                Logo Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () => applyNavUpdate({ logoImage: reader.result as string });
                  reader.readAsDataURL(file);
                }}
                id={`nav-logo-${component.id}`}
                className="hidden"
              />
              <label
                htmlFor={`nav-logo-${component.id}`}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium border border-[oklch(0.9200_0.005_20)] rounded-lg cursor-pointer hover:bg-[oklch(0.9600_0.008_30)] transition"
              >
                <Upload className="h-4 w-4" />
                {navData.logoImage ? "Replace Logo" : "Upload Logo"}
              </label>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
                  Menu Items
                </span>
                <button
                  onClick={addMenuItem}
                  disabled={menuItems.length >= 4}
                  className="text-xs text-[oklch(0.6500_0.22_25)] disabled:opacity-40"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <div key={item.id} className="p-3 border border-[oklch(0.9200_0.005_20)] rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[oklch(0.5200_0.015_25)]">
                        {item.label || "Menu"}
                      </span>
                      <button
                        onClick={() => removeMenuItem(item.id)}
                        className="text-[oklch(0.5500_0.26_15)] text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <InputField
                      label="Label"
                      icon={<Type className="h-3.5 w-3.5" />}
                      value={item.label}
                      onChange={(v: string) => handleMenuItemChange(item.id, "label", v)}
                    />
                    <SelectField
                      label="Link Type"
                      icon={<Link className="h-3.5 w-3.5" />}
                      value={item.targetType}
                      onChange={(v: string) =>
                        handleMenuItemChange(
                          item.id,
                          "targetType",
                          v as NavigationComponentData["menuItems"][number]["targetType"]
                        )
                      }
                      options={[
                        { value: "page", label: "Page Anchor" },
                        { value: "link", label: "External Link" },
                        { value: "email", label: "Email" },
                        { value: "phone", label: "Phone" },
                      ]}
                    />
                    <InputField
                      label="Destination"
                      icon={<Link className="h-3.5 w-3.5" />}
                      value={item.targetValue}
                      onChange={(v: string) => handleMenuItemChange(item.id, "targetValue", v)}
                      placeholder="#section"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "layout",
        label: "Layout",
        icon: <Layout className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <SelectField
              label="Desktop Display"
              icon={<Layout className="h-3.5 w-3.5" />}
              value={navData.menuDisplay}
              onChange={(v: string) =>
                applyNavUpdate({ menuDisplay: v as NavigationComponentData["menuDisplay"] })
              }
              options={[
                { value: "inline", label: "Inline menu" },
                { value: "hamburger", label: "Hamburger menu" },
              ]}
            />
            <ToggleField
              label="Sticky Header"
              icon={<Layout className="h-3.5 w-3.5" />}
              checked={navData.isSticky ?? false}
              onChange={(checked: boolean) => applyNavUpdate({ isSticky: checked })}
            />
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <ColorPicker
              label="Background"
              icon={<Palette className="h-3.5 w-3.5" />}
              value={(component as any).styles?.backgroundColor || "#ffffff"}
              onChange={(v: string) =>
                updateComponent(component.id, {
                  ...(component as any),
                  styles: { ...((component as any).styles || {}), backgroundColor: v },
                })
              }
            />
            <ColorPicker
              label="Text Color"
              icon={<Type className="h-3.5 w-3.5" />}
              value={(component as any).styles?.color || "#111111"}
              onChange={(v: string) =>
                updateComponent(component.id, {
                  ...(component as any),
                  styles: { ...((component as any).styles || {}), color: v },
                })
              }
            />
            <ColorPicker
              label="Hover Color"
              icon={<Type className="h-3.5 w-3.5" />}
              value={
                ((component as any).styles || {})["--menu-hover-color"] || "#111111"
              }
              onChange={(v: string) =>
                updateComponent(component.id, {
                  ...(component as any),
                  styles: {
                    ...((component as any).styles || {}),
                    ["--menu-hover-color" as keyof React.CSSProperties]: v,
                  },
                })
              }
            />
          </div>
        ),
      },
      {
        id: "cta",
        label: "Call to Action",
        icon: <MousePointerClick className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <ToggleField
              label="Show Button"
              icon={<MousePointerClick className="h-3.5 w-3.5" />}
              checked={navData.button?.enabled ?? false}
              onChange={(checked: boolean) =>
                applyNavUpdate({
                  button: {
                    enabled: checked,
                    label: navData.button?.label || "Let’s Chat",
                    iconMode: navData.button?.iconMode || "text",
                    icon: navData.button?.icon || "↗",
                    iconPlacement: navData.button?.iconPlacement || "left",
                    style: navData.button?.style || "solid",
                    linkType: navData.button?.linkType || "page",
                    linkValue: navData.button?.linkValue || "#",
                  },
                })
              }
            />
            {navData.button?.enabled && (
              <div className="space-y-3">
                <InputField
                  label="Button Label"
                  icon={<Type className="h-3.5 w-3.5" />}
                  value={navData.button.label}
                  onChange={(v: string) => applyNavUpdate({ 
                button: { 
                  enabled: navData.button?.enabled ?? false,
                  label: v,
                  iconMode: navData.button?.iconMode || 'text',
                  iconPlacement: navData.button?.iconPlacement || 'left',
                  style: navData.button?.style || 'solid',
                  linkType: navData.button?.linkType || 'page',
                  linkValue: navData.button?.linkValue || '',
                  icon: navData.button?.icon || '',
                } 
              })}
                />
                <SelectField
                  label="Button Style"
                  icon={<Palette className="h-3.5 w-3.5" />}
                  value={navData.button.style}
                  onChange={(v: string) =>
                    applyNavUpdate({ 
                      button: { 
                        enabled: navData.button?.enabled ?? false,
                        label: navData.button?.label || '',
                        iconMode: navData.button?.iconMode || 'text',
                        iconPlacement: navData.button?.iconPlacement || 'left',
                        style: v as any,
                        linkType: navData.button?.linkType || 'page',
                        linkValue: navData.button?.linkValue || '',
                        icon: navData.button?.icon || '',
                      } 
                    })
                  }
                  options={[
                    { value: "solid", label: "Solid" },
                    { value: "outline", label: "Outline" },
                    { value: "ghost", label: "Ghost" },
                  ]}
                />
                <SelectField
                  label="Icon Mode"
                  icon={<Layout className="h-3.5 w-3.5" />}
                  value={navData.button.iconMode}
                  onChange={(v: string) =>
                    applyNavUpdate({ 
                      button: { 
                        enabled: navData.button?.enabled ?? false,
                        label: navData.button?.label || '',
                        iconMode: v as any,
                        iconPlacement: navData.button?.iconPlacement || 'left',
                        style: navData.button?.style || 'solid',
                        linkType: navData.button?.linkType || 'page',
                        linkValue: navData.button?.linkValue || '',
                        icon: navData.button?.icon || '',
                      } 
                    })
                  }
                  options={[
                    { value: "text", label: "Text only" },
                    { value: "icon", label: "Icon only" },
                    { value: "both", label: "Icon + Text" },
                  ]}
                />
                {navData.button.iconMode !== "text" && (
                  <SelectField
                    label="Icon Placement"
                    icon={<Layout className="h-3.5 w-3.5" />}
                    value={navData.button.iconPlacement || "left"}
                    onChange={(v: string) =>
                      applyNavUpdate({
                        button: { 
                          enabled: navData.button?.enabled ?? false,
                          label: navData.button?.label || '',
                          iconMode: navData.button?.iconMode || 'text',
                          iconPlacement: v as "left" | "right",
                          style: navData.button?.style || 'solid',
                          linkType: navData.button?.linkType || 'page',
                          linkValue: navData.button?.linkValue || '',
                          icon: navData.button?.icon || '',
                        },
                      })
                    }
                    options={[
                      { value: "left", label: "Left of text" },
                      { value: "right", label: "Right of text" },
                    ]}
                  />
                )}
                {navData.button.iconMode !== "text" && (
                  <InputField
                    label="Icon"
                    icon={<Type className="h-3.5 w-3.5" />}
                    value={navData.button.icon || ""}
                    onChange={(v: string) => applyNavUpdate({ 
                      button: { 
                        enabled: navData.button?.enabled ?? false,
                        label: navData.button?.label || '',
                        iconMode: navData.button?.iconMode || 'text',
                        iconPlacement: navData.button?.iconPlacement || 'left',
                        style: navData.button?.style || 'solid',
                        linkType: navData.button?.linkType || 'page',
                        linkValue: navData.button?.linkValue || '',
                        icon: v,
                      } 
                    })}
                    placeholder="↗"
                  />
                )}
                <SelectField
                  label="Link Type"
                  icon={<Link className="h-3.5 w-3.5" />}
                  value={navData.button.linkType}
                  onChange={(v: string) =>
                    applyNavUpdate({ 
                      button: { 
                        enabled: navData.button?.enabled ?? false,
                        label: navData.button?.label || '',
                        iconMode: navData.button?.iconMode || 'text',
                        iconPlacement: navData.button?.iconPlacement || 'left',
                        style: navData.button?.style || 'solid',
                        linkType: v as any,
                        linkValue: navData.button?.linkValue || '',
                        icon: navData.button?.icon || '',
                      } 
                    })
                  }
                  options={[
                    { value: "page", label: "Page Anchor" },
                    { value: "link", label: "External Link" },
                    { value: "email", label: "Email" },
                    { value: "phone", label: "Phone" },
                  ]}
                />
                <InputField
                  label="Destination"
                  icon={<Link className="h-3.5 w-3.5" />}
                  value={navData.button.linkValue}
                  onChange={(v: string) => applyNavUpdate({ 
                    button: { 
                      enabled: navData.button?.enabled ?? false,
                      label: navData.button?.label || '',
                      iconMode: navData.button?.iconMode || 'text',
                      iconPlacement: navData.button?.iconPlacement || 'left',
                      style: navData.button?.style || 'solid',
                      linkType: navData.button?.linkType || 'page',
                      linkValue: v,
                      icon: navData.button?.icon || '',
                    } 
                  })}
                  placeholder="#contact"
                />
              </div>
            )}
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // Contact Details component
  if (component.type === "contact-details") {
    const contactData = component as ContactDetailsComponentData;
    const updateData = (updates: Partial<ContactDetailsComponentData>) => {
      updateComponent(component.id, { ...contactData, ...updates });
    };

    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <SelectField
              label="Display Style"
              icon={<Layout className="h-3.5 w-3.5" />}
              value={contactData.variant || "default"}
              onChange={(v: string) => updateData({ variant: v as any })}
              options={[
                { value: "default", label: "Default" },
                { value: "minimal", label: "Minimal" },
                { value: "card", label: "Card" },
                { value: "inline", label: "Inline" },
              ]}
            />
            <InputField
              label="Email"
              icon={<Mail className="h-3.5 w-3.5" />}
              value={contactData.email || ""}
              onChange={(v: string) => updateData({ email: v })}
              placeholder="your@email.com"
              type="email"
            />
            <InputField
              label="Phone"
              icon={<Phone className="h-3.5 w-3.5" />}
              value={contactData.phone || ""}
              onChange={(v: string) => updateData({ phone: v })}
              placeholder="+1 (555) 123-4567"
              type="tel"
            />
            <InputField
              label="Location"
              icon={<MapPin className="h-3.5 w-3.5" />}
              value={contactData.location || ""}
              onChange={(v: string) => updateData({ location: v })}
              placeholder="City, Country"
            />
            <InputField
              label="Website"
              icon={<Globe className="h-3.5 w-3.5" />}
              value={contactData.website || ""}
              onChange={(v: string) => updateData({ website: v })}
              placeholder="https://yourwebsite.com"
              type="url"
            />
            <InputField
              label="Availability"
              icon={<Calendar className="h-3.5 w-3.5" />}
              value={contactData.availability || ""}
              onChange={(v: string) => updateData({ availability: v })}
              placeholder="Available for freelance"
            />
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <SliderField
              label="Corner Radius"
              icon={<Maximize className="h-3.5 w-3.5" />}
              value={parseFloat(styles.borderRadius?.replace("px", "") || "0")}
              onChange={(v: number) => updateStyles({ borderRadius: `${v}px` })}
              min={0}
              max={50}
              step={1}
              unit="px"
            />
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // Contact Form component
  if (component.type === "contact-form") {
    const formData = component as ContactFormComponentData;
    const data = component as any;
    const styles = data.styles || {};
    const updateData = (updates: Partial<ContactFormComponentData>) => {
      updateComponent(component.id, { ...formData, ...updates });
    };
    const updateStyles = (styleUpdates: any) => {
      updateComponent(component.id, {
        ...formData,
        styles: { ...styles, ...styleUpdates },
      } as any);
    };

    const availableFields = [
      { name: 'name', label: 'Full Name', type: 'text' as const },
      { name: 'email', label: 'Email Address', type: 'email' as const },
      { name: 'phone', label: 'Phone Number', type: 'tel' as const },
      { name: 'company', label: 'Company', type: 'text' as const },
      { name: 'subject', label: 'Subject', type: 'text' as const },
      { name: 'message', label: 'Message', type: 'textarea' as const },
    ];

    const handleToggleField = (fieldName: string, fieldType: 'text' | 'email' | 'tel' | 'textarea', fieldLabel: string) => {
      const existingIndex = formData.fields.findIndex((f) => f.name === fieldName);
      if (existingIndex >= 0) {
        const newFields = formData.fields.filter((_, i) => i !== existingIndex);
        updateData({ fields: newFields });
      } else {
        const newField = {
          name: fieldName,
          type: fieldType,
          required: fieldName === 'email' || fieldName === 'message',
          placeholder: fieldLabel,
        };
        updateData({ fields: [...formData.fields, newField] });
      }
    };

    const handleUpdateField = (index: number, updates: Partial<ContactFormComponentData['fields'][0]>) => {
      const newFields = [...formData.fields];
      newFields[index] = { ...newFields[index], ...updates };
      updateData({ fields: newFields });
    };

    const handleRemoveField = (index: number) => {
      const newFields = formData.fields.filter((_, i) => i !== index);
      updateData({ fields: newFields });
    };

    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <SelectField
              label="Layout"
              icon={<Layout className="h-3.5 w-3.5" />}
              value={formData.layout || (formData.showProfileCard ? "split" : "single")}
              onChange={(v: string) => updateData({ layout: v as any })}
              options={[
                { value: "single", label: "Single Column" },
                { value: "split", label: "Split with Profile" },
              ]}
            />
            <div className="grid grid-cols-2 gap-2">
              <SelectField
                label="Alignment"
                icon={<AlignLeft className="h-3.5 w-3.5" />}
                value={formData.alignment || "left"}
                onChange={(v: string) => updateData({ alignment: v as any })}
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right" },
                ]}
              />
              <div>
                <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
                  <Maximize className="h-3.5 w-3.5" />
                  Width
                </label>
                <select
                  value={formData.width || (formData.layout === 'split' ? 'max-w-7xl' : 'max-w-5xl')}
                  onChange={(e) => updateData({ width: e.target.value === 'custom' ? 'custom' : e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                >
                  <option value="max-w-xs">Extra Small (max-w-xs)</option>
                  <option value="max-w-sm">Small (max-w-sm)</option>
                  <option value="max-w-md">Medium (max-w-md)</option>
                  <option value="max-w-lg">Large (max-w-lg)</option>
                  <option value="max-w-xl">Extra Large (max-w-xl)</option>
                  <option value="max-w-2xl">2XL (max-w-2xl)</option>
                  <option value="max-w-3xl">3XL (max-w-3xl)</option>
                  <option value="max-w-4xl">4XL (max-w-4xl)</option>
                  <option value="max-w-5xl">5XL (max-w-5xl) - Recommended</option>
                  <option value="max-w-6xl">6XL (max-w-6xl)</option>
                  <option value="max-w-7xl">7XL (max-w-7xl)</option>
                  <option value="w-full">Full Width (100%)</option>
                  <option value="custom">Custom...</option>
                </select>
                {formData.width === 'custom' && (
                  <InputField
                    label="Custom Width"
                    icon={<Ruler className="h-3.5 w-3.5" />}
                    value=""
                    onChange={(v: string) => {
                      if (v && (v.includes('px') || v.includes('%'))) {
                        updateData({ width: v });
                      } else if (!v) {
                        updateData({ width: 'max-w-5xl' });
                      }
                    }}
                    placeholder="1200px or 90%"
                    type="text"
                  />
                )}
              </div>
            </div>
            <SelectField
              label="Style"
              icon={<Palette className="h-3.5 w-3.5" />}
              value={formData.style || "default"}
              onChange={(v: string) => updateData({ style: v as any })}
              options={[
                { value: "default", label: "Default" },
                { value: "minimal", label: "Minimal" },
                { value: "bordered", label: "Bordered" },
                { value: "gradient", label: "Gradient" },
              ]}
            />
            
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <FileText className="h-3.5 w-3.5" />
                Header Section
              </label>
              <ToggleField
                label="Show Header"
                icon={<Eye className="h-3.5 w-3.5" />}
                checked={formData.showHeader !== false}
                onChange={(v: boolean) => updateData({ showHeader: v })}
              />
              {formData.showHeader !== false && (
                <>
                  <InputField
                    label="Header Title"
                    icon={<Type className="h-3.5 w-3.5" />}
                    value={formData.headerTitle || ""}
                    onChange={(v: string) => updateData({ headerTitle: v })}
                    placeholder="Love to hear from you, Get in touch 👋"
                  />
                  <InputField
                    label="Header Subtitle"
                    icon={<FileText className="h-3.5 w-3.5" />}
                    value={formData.headerSubtitle || ""}
                    onChange={(v: string) => updateData({ headerSubtitle: v })}
                    placeholder="Optional subtitle text"
                  />
                </>
              )}
            </div>

            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <User className="h-3.5 w-3.5" />
                Profile Card
              </label>
              <ToggleField
                label="Show Profile Card"
                icon={<User className="h-3.5 w-3.5" />}
                checked={formData.showProfileCard || false}
                onChange={(v: boolean) => {
                  updateData({ 
                    showProfileCard: v,
                    layout: v ? 'split' : 'single'
                  });
                }}
              />
              {formData.showProfileCard && (
                <>
                  <InputField
                    label="Profile Name"
                    icon={<User className="h-3.5 w-3.5" />}
                    value={formData.profileCardName || ""}
                    onChange={(v: string) => updateData({ profileCardName: v })}
                    placeholder="Cameron Williamson"
                  />
                  <InputField
                    label="Profile Title"
                    icon={<Briefcase className="h-3.5 w-3.5" />}
                    value={formData.profileCardTitle || ""}
                    onChange={(v: string) => updateData({ profileCardTitle: v })}
                    placeholder="Sales Manager"
                  />
                  <InputField
                    label="Profile Image URL"
                    icon={<ImageIcon className="h-3.5 w-3.5" />}
                    value={formData.profileCardImage || ""}
                    onChange={(v: string) => updateData({ profileCardImage: v })}
                    placeholder="https://example.com/avatar.jpg"
                    type="url"
                  />
                  <InputField
                    label="Profile Description"
                    icon={<FileText className="h-3.5 w-3.5" />}
                    value={formData.profileCardDescription || ""}
                    onChange={(v: string) => updateData({ profileCardDescription: v })}
                    placeholder="Let us show you how we can help..."
                    type="textarea"
                  />
                </>
              )}
            </div>

            <div className="pt-2 border-t space-y-3">
              <InputField
                label="Submit Button Text"
                icon={<MousePointerClick className="h-3.5 w-3.5" />}
                value={formData.submitText || ""}
                onChange={(v: string) => updateData({ submitText: v })}
                placeholder="Send Message"
              />
            </div>
            
            <div className="space-y-3 pt-2 border-t">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <FileText className="h-3.5 w-3.5" />
                Available Fields
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableFields.map((field) => {
                  const isSelected = formData.fields.some((f) => f.name === field.name);
                  return (
                    <button
                      key={field.name}
                      onClick={() => handleToggleField(field.name, field.type, field.label)}
                      className={`flex items-center gap-2 p-2.5 border rounded-lg transition-colors text-left ${
                        isSelected
                          ? 'border-[oklch(0.6500_0.22_25)] bg-[oklch(0.6500_0.22_25)]/10'
                          : 'border-[oklch(0.9200_0.005_20)] hover:bg-[oklch(0.9600_0.008_30)]'
                      }`}
                    >
                      <CheckSquare className={`h-4 w-4 ${isSelected ? 'text-[oklch(0.6500_0.22_25)]' : 'text-[oklch(0.5200_0.015_25)]'}`} />
                      <span className="text-xs font-medium">{field.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {formData.fields.length > 0 && (
              <div className="space-y-3 pt-2 border-t">
                <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                  <Settings className="h-3.5 w-3.5" />
                  Configure Fields
                </label>
                {formData.fields.map((field, index) => (
                  <div key={index} className="p-3 bg-[oklch(0.9600_0.008_30)] rounded-lg space-y-2 border border-[oklch(0.9200_0.005_20)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{field.placeholder || field.name}</span>
                      <button
                        onClick={() => handleRemoveField(index)}
                        className="p-1 hover:bg-[oklch(0.9200_0.005_20)] rounded transition-colors"
                      >
                        <X className="h-3.5 w-3.5 text-[oklch(0.5200_0.015_25)]" />
                      </button>
                    </div>
                    <InputField
                      label="Placeholder"
                      value={field.placeholder || ""}
                      onChange={(v: string) => handleUpdateField(index, { placeholder: v })}
                      placeholder="Field placeholder"
                    />
                    <ToggleField
                      label="Required Field"
                      icon={<Lock className="h-3.5 w-3.5" />}
                      checked={field.required}
                      onChange={(v: boolean) => handleUpdateField(index, { required: v })}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Palette className="h-3.5 w-3.5" />
                Colors
              </label>
              <ColorPicker
                label="Input Background Color"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.inputBackgroundColor || (formData as any).inputBackgroundColor || "#ffffff"}
                onChange={(v: string) => {
                  updateStyles({ inputBackgroundColor: v });
                  updateData({ ...formData, inputBackgroundColor: v } as any);
                }}
              />
              <ColorPicker
                label="Text Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.color || designPalette.titleColor || "#000000"}
                onChange={(v: string) => updateStyles({ color: v })}
              />
              <ColorPicker
                label="Border Color"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={styles.borderColor || "#e5e7eb"}
                onChange={(v: string) => updateStyles({ borderColor: v })}
              />
              <ColorPicker
                label="Button Background"
                icon={<MousePointerClick className="h-3.5 w-3.5" />}
                value={(formData as any).buttonColor || designPalette.primaryColor || "#000000"}
                onChange={(v: string) => updateData({ ...formData, buttonColor: v } as any)}
              />
              <ColorPicker
                label="Button Text Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={(formData as any).buttonTextColor || "#ffffff"}
                onChange={(v: string) => updateData({ ...formData, buttonTextColor: v } as any)}
              />
            </div>
            
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Maximize className="h-3.5 w-3.5" />
                Border & Radius
              </label>
              <SliderField
                label="Corner Radius"
                icon={<Maximize className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderRadius?.replace("px", "") || "16")}
                onChange={(v: number) => updateStyles({ borderRadius: `${v}px` })}
                min={0}
                max={50}
                step={1}
                unit="px"
              />
              <SliderField
                label="Border Width"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderWidth?.replace("px", "") || "1")}
                onChange={(v: number) => updateStyles({ borderWidth: `${v}px` })}
                min={0}
                max={10}
                step={1}
                unit="px"
              />
            </div>

            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Layers className="h-3.5 w-3.5" />
                Spacing
              </label>
              <SliderField
                label="Padding"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.padding?.replace("px", "") || "32")}
                onChange={(v: number) => updateStyles({ padding: `${v}px` })}
                min={0}
                max={80}
                step={4}
                unit="px"
              />
              <SliderField
                label="Field Spacing"
                icon={<ArrowDown className="h-3.5 w-3.5" />}
                value={parseFloat((formData as any).fieldSpacing?.replace("px", "") || "24")}
                onChange={(v: number) => updateData({ ...formData, fieldSpacing: `${v}px` } as any)}
                min={8}
                max={48}
                step={4}
                unit="px"
              />
            </div>

            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Sparkles className="h-3.5 w-3.5" />
                Effects
              </label>
              <SliderField
                label="Shadow"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.boxShadow?.replace("px", "") || (formData as any).shadow?.replace("px", "") || "0")}
                onChange={(v: number) => {
                  updateStyles({ boxShadow: `${v}px ${v}px ${v * 2}px rgba(0,0,0,0.1)` });
                  updateData({ ...formData, shadow: `${v}px` } as any);
                }}
                min={0}
                max={50}
                step={2}
                unit="px"
              />
            </div>
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // Profile component
  if (component.type === "profile") {
    const profileData = component as any;
    const updateData = (updates: any) => {
      updateComponent(component.id, { ...profileData, ...updates });
    };

    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <InputField
              label="Full Name"
              icon={<User className="h-3.5 w-3.5" />}
              value={profileData.name || ""}
              onChange={(v: string) => updateData({ name: v })}
              placeholder="John Doe"
            />
            <InputField
              label="Job Title"
              icon={<Briefcase className="h-3.5 w-3.5" />}
              value={profileData.jobTitle || ""}
              onChange={(v: string) => updateData({ jobTitle: v })}
              placeholder="Senior Software Engineer"
            />
            <InputField
              label="Section Title"
              icon={<Type className="h-3.5 w-3.5" />}
              value={profileData.title || ""}
              onChange={(v: string) => updateData({ title: v })}
              placeholder="About Me"
            />
            <InputField
              label="Professional Summary"
              icon={<FileText className="h-3.5 w-3.5" />}
              value={profileData.summary || ""}
              onChange={(v: string) => updateData({ summary: v })}
              placeholder="Write a brief professional summary..."
              type="textarea"
            />
            <div className="pt-2 border-t">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-2">
                <ImageIcon className="h-3.5 w-3.5" />
                Profile Photo
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        updateData({ avatar: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                  id="profile-avatar-upload"
                />
                <label
                  htmlFor="profile-avatar-upload"
                  className="flex-1 px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded cursor-pointer hover:bg-[oklch(0.9600_0.008_30)] transition-colors text-center"
                >
                  {profileData.avatar ? "Change Photo" : "Upload Photo"}
                </label>
                {profileData.avatar && (
                  <button
                    onClick={() => updateData({ avatar: "" })}
                    className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Palette className="h-3.5 w-3.5" />
                Colors
              </label>
              <ColorPicker
                label="Name Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.color || designPalette.titleColor || "#000000"}
                onChange={(v: string) => updateStyles({ color: v })}
              />
              <ColorPicker
                label="Title Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.titleColor || designPalette.titleColor || "#000000"}
                onChange={(v: string) => updateStyles({ titleColor: v })}
              />
              <ColorPicker
                label="Description Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.descriptionColor || designPalette.descriptionColor || "#666666"}
                onChange={(v: string) => updateStyles({ descriptionColor: v })}
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Maximize className="h-3.5 w-3.5" />
                Spacing
              </label>
              <SliderField
                label="Item Spacing"
                icon={<ArrowDown className="h-3.5 w-3.5" />}
                value={parseFloat((profileData as any).spacing?.replace("px", "") || "24")}
                onChange={(v: number) => updateData({ ...profileData, spacing: `${v}px` } as any)}
                min={8}
                max={48}
                step={4}
                unit="px"
              />
            </div>
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // Skills component
  if (component.type === "skills") {
    const skillsData = component as any;
    const updateData = (updates: any) => {
      updateComponent(component.id, { ...skillsData, ...updates });
    };

    const handleAddSkill = (skill: string) => {
      if (skill.trim() && !skillsData.skills.includes(skill.trim())) {
        updateData({ skills: [...(skillsData.skills || []), skill.trim()] });
      }
    };

    const handleRemoveSkill = (index: number) => {
      const newSkills = skillsData.skills.filter((_: any, i: number) => i !== index);
      updateData({ skills: newSkills });
    };

    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <SelectField
              label="Alignment"
              icon={<AlignLeft className="h-3.5 w-3.5" />}
              value={skillsData.alignment || "left"}
              onChange={(v: string) => updateData({ alignment: v })}
              options={[
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ]}
            />
            <SelectField
              label="Style Variant"
              icon={<Palette className="h-3.5 w-3.5" />}
              value={skillsData.variant || "pill"}
              onChange={(v: string) => updateData({ variant: v })}
              options={[
                { value: "pill", label: "Pill" },
                { value: "badge", label: "Badge" },
                { value: "minimal", label: "Minimal" },
                { value: "outlined", label: "Outlined" },
              ]}
            />
            <div className="space-y-3 pt-2 border-t">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <FileText className="h-3.5 w-3.5" />
                Skills
              </label>
              <div className="flex gap-2">
                <InputField
                  label=""
                  value=""
                  onChange={(v: string) => {
                    if (v && v.includes(',')) {
                      v.split(',').forEach(skill => handleAddSkill(skill.trim()));
                    }
                  }}
                  onKeyDown={(e: any) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  placeholder="Type skill and press Enter (or comma-separated)"
                />
              </div>
              {(skillsData.skills || []).length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-[oklch(0.9600_0.008_30)] rounded-lg border border-[oklch(0.9200_0.005_20)]">
                  {(skillsData.skills || []).map((skill: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-[oklch(0.9200_0.005_20)]">
                      <span className="text-xs">{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        className="p-0.5 hover:bg-[oklch(0.9600_0.008_30)] rounded transition-colors"
                      >
                        <X className="h-3 w-3 text-[oklch(0.5200_0.015_25)]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Palette className="h-3.5 w-3.5" />
                Colors
              </label>
              <ColorPicker
                label="Text Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.color || designPalette.titleColor || "#000000"}
                onChange={(v: string) => updateStyles({ color: v })}
              />
              <ColorPicker
                label="Background Color"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.backgroundColor || "#ffffff"}
                onChange={(v: string) => updateStyles({ backgroundColor: v })}
              />
              <ColorPicker
                label="Border Color"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={styles.borderColor || "#e5e7eb"}
                onChange={(v: string) => updateStyles({ borderColor: v })}
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Maximize className="h-3.5 w-3.5" />
                Border & Radius
              </label>
              <SliderField
                label="Corner Radius"
                icon={<Maximize className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderRadius?.replace("px", "") || "24")}
                onChange={(v: number) => updateStyles({ borderRadius: `${v}px` })}
                min={0}
                max={50}
                step={1}
                unit="px"
              />
              <SliderField
                label="Border Width"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderWidth?.replace("px", "") || "1")}
                onChange={(v: number) => updateStyles({ borderWidth: `${v}px` })}
                min={0}
                max={5}
                step={1}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Layers className="h-3.5 w-3.5" />
                Spacing
              </label>
              <SliderField
                label="Gap Between Skills"
                icon={<ArrowDown className="h-3.5 w-3.5" />}
                value={parseFloat((skillsData as any).gap?.replace("px", "") || "8")}
                onChange={(v: number) => updateData({ ...skillsData, gap: `${v}px` } as any)}
                min={4}
                max={24}
                step={2}
                unit="px"
              />
              <SliderField
                label="Padding"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.padding?.replace("px", "") || "8")}
                onChange={(v: number) => updateStyles({ padding: `${v}px` })}
                min={4}
                max={24}
                step={2}
                unit="px"
              />
            </div>
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // Experience component
  if (component.type === "experience") {
    const expData = component as any;
    const updateData = (updates: any) => {
      updateComponent(component.id, { ...expData, ...updates });
    };

    const handleAddExperience = () => {
      const newExp = {
        position: '',
        company: '',
        period: '',
        description: '',
      };
      updateData({ experiences: [...(expData.experiences || []), newExp] });
    };

    const handleRemoveExperience = (index: number) => {
      const newExps = (expData.experiences || []).filter((_: any, i: number) => i !== index);
      updateData({ experiences: newExps });
    };

    const handleUpdateExperience = (index: number, field: string, value: string) => {
      const newExps = [...(expData.experiences || [])];
      newExps[index] = { ...newExps[index], [field]: value };
      updateData({ experiences: newExps });
    };

    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Briefcase className="h-3.5 w-3.5" />
                Work Experience
              </label>
              <button
                onClick={handleAddExperience}
                className="px-3 py-1.5 text-xs font-medium bg-[oklch(0.6500_0.22_25)] text-white rounded hover:bg-[oklch(0.6000_0.22_25)] transition-colors flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Experience
              </button>
            </div>
            {(expData.experiences || []).map((exp: any, index: number) => (
              <div key={index} className="p-4 bg-[oklch(0.9600_0.008_30)] rounded-lg border border-[oklch(0.9200_0.005_20)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[oklch(0.2200_0.015_20)]">Experience #{index + 1}</span>
                  <button
                    onClick={() => handleRemoveExperience(index)}
                    className="p-1 hover:bg-[oklch(0.9200_0.005_20)] rounded transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-[oklch(0.5200_0.015_25)]" />
                  </button>
                </div>
                <InputField
                  label="Position"
                  value={exp.position || ""}
                  onChange={(v: string) => handleUpdateExperience(index, 'position', v)}
                  placeholder="Senior Software Engineer"
                />
                <InputField
                  label="Company"
                  value={exp.company || ""}
                  onChange={(v: string) => handleUpdateExperience(index, 'company', v)}
                  placeholder="Tech Company Inc."
                />
                <InputField
                  label="Period"
                  value={exp.period || ""}
                  onChange={(v: string) => handleUpdateExperience(index, 'period', v)}
                  placeholder="2020 - Present"
                />
                <InputField
                  label="Description"
                  value={exp.description || ""}
                  onChange={(v: string) => handleUpdateExperience(index, 'description', v)}
                  placeholder="Describe your role and achievements..."
                  type="textarea"
                />
              </div>
            ))}
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Palette className="h-3.5 w-3.5" />
                Colors
              </label>
              <ColorPicker
                label="Title Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.color || designPalette.titleColor || "#000000"}
                onChange={(v: string) => updateStyles({ color: v })}
              />
              <ColorPicker
                label="Company Color"
                icon={<Briefcase className="h-3.5 w-3.5" />}
                value={styles.companyColor || designPalette.primaryColor || "#000000"}
                onChange={(v: string) => updateStyles({ companyColor: v })}
              />
              <ColorPicker
                label="Description Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.descriptionColor || designPalette.descriptionColor || "#666666"}
                onChange={(v: string) => updateStyles({ descriptionColor: v })}
              />
              <ColorPicker
                label="Background Color"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.backgroundColor || "#ffffff"}
                onChange={(v: string) => updateStyles({ backgroundColor: v })}
              />
              <ColorPicker
                label="Border Color"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={styles.borderColor || "#e5e7eb"}
                onChange={(v: string) => updateStyles({ borderColor: v })}
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Maximize className="h-3.5 w-3.5" />
                Border & Radius
              </label>
              <SliderField
                label="Corner Radius"
                icon={<Maximize className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderRadius?.replace("px", "") || "12")}
                onChange={(v: number) => updateStyles({ borderRadius: `${v}px` })}
                min={0}
                max={50}
                step={1}
                unit="px"
              />
              <SliderField
                label="Border Width"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderWidth?.replace("px", "") || "1")}
                onChange={(v: number) => updateStyles({ borderWidth: `${v}px` })}
                min={0}
                max={5}
                step={1}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Layers className="h-3.5 w-3.5" />
                Spacing
              </label>
              <SliderField
                label="Item Spacing"
                icon={<ArrowDown className="h-3.5 w-3.5" />}
                value={parseFloat((expData as any).spacing?.replace("px", "") || "24")}
                onChange={(v: number) => updateData({ ...expData, spacing: `${v}px` } as any)}
                min={8}
                max={48}
                step={4}
                unit="px"
              />
              <SliderField
                label="Padding"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.padding?.replace("px", "") || "24")}
                onChange={(v: number) => updateStyles({ padding: `${v}px` })}
                min={8}
                max={48}
                step={4}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Sparkles className="h-3.5 w-3.5" />
                Effects
              </label>
              <SliderField
                label="Shadow"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.boxShadow?.replace("px", "") || "0")}
                onChange={(v: number) => updateStyles({ boxShadow: `${v}px ${v}px ${v * 2}px rgba(0,0,0,0.1)` })}
                min={0}
                max={50}
                step={2}
                unit="px"
              />
            </div>
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // Projects component
  if (component.type === "projects") {
    const projectsData = component as any;
    const updateData = (updates: any) => {
      updateComponent(component.id, { ...projectsData, ...updates });
    };

    const handleAddProject = () => {
      const newProject = { title: '', link: '', image: '', description: '' };
      updateData({ projects: [...(projectsData.projects || []), newProject] });
    };

    const handleRemoveProject = (index: number) => {
      const newProjects = (projectsData.projects || []).filter((_: any, i: number) => i !== index);
      updateData({ projects: newProjects });
    };

    const handleUpdateProject = (index: number, field: string, value: string) => {
      const newProjects = [...(projectsData.projects || [])];
      newProjects[index] = { ...newProjects[index], [field]: value };
      updateData({ projects: newProjects });
    };

    const handleImageUpload = (index: number, file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateProject(index, 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    };

    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <FolderOpen className="h-3.5 w-3.5" />
                Projects
              </label>
              <div className="flex items-center gap-2">
                <SelectField
                  label=""
                  value={projectsData.mode || "grid"}
                  onChange={(v: string) => updateData({ mode: v })}
                  options={[
                    { value: "grid", label: "Grid" },
                    { value: "list", label: "List" },
                    { value: "carousel", label: "Carousel" },
                  ]}
                />
                <button
                  onClick={handleAddProject}
                  className="px-3 py-1.5 text-xs font-medium bg-[oklch(0.6500_0.22_25)] text-white rounded hover:bg-[oklch(0.6000_0.22_25)] transition-colors flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>
            </div>
            {(projectsData.projects || []).map((project: any, index: number) => (
              <div key={index} className="p-4 bg-[oklch(0.9600_0.008_30)] rounded-lg border border-[oklch(0.9200_0.005_20)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[oklch(0.2200_0.015_20)]">Project #{index + 1}</span>
                  <button
                    onClick={() => handleRemoveProject(index)}
                    className="p-1 hover:bg-[oklch(0.9200_0.005_20)] rounded transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-[oklch(0.5200_0.015_25)]" />
                  </button>
                </div>
                <InputField
                  label="Title"
                  value={project.title || ""}
                  onChange={(v: string) => handleUpdateProject(index, 'title', v)}
                  placeholder="Project Name"
                />
                <InputField
                  label="Link"
                  value={project.link || ""}
                  onChange={(v: string) => handleUpdateProject(index, 'link', v)}
                  placeholder="https://project.com"
                  type="url"
                />
                <InputField
                  label="Description"
                  value={project.description || ""}
                  onChange={(v: string) => handleUpdateProject(index, 'description', v)}
                  placeholder="Project description..."
                  type="textarea"
                />
                <div>
                  <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Project Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(index, file);
                    }}
                    className="w-full text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Palette className="h-3.5 w-3.5" />
                Colors
              </label>
              <ColorPicker
                label="Title Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.color || designPalette.titleColor || "#000000"}
                onChange={(v: string) => updateStyles({ color: v })}
              />
              <ColorPicker
                label="Description Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.descriptionColor || designPalette.descriptionColor || "#666666"}
                onChange={(v: string) => updateStyles({ descriptionColor: v })}
              />
              <ColorPicker
                label="Background Color"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.backgroundColor || "#ffffff"}
                onChange={(v: string) => updateStyles({ backgroundColor: v })}
              />
              <ColorPicker
                label="Border Color"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={styles.borderColor || "#e5e7eb"}
                onChange={(v: string) => updateStyles({ borderColor: v })}
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Maximize className="h-3.5 w-3.5" />
                Border & Radius
              </label>
              <SliderField
                label="Corner Radius"
                icon={<Maximize className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderRadius?.replace("px", "") || "12")}
                onChange={(v: number) => updateStyles({ borderRadius: `${v}px` })}
                min={0}
                max={50}
                step={1}
                unit="px"
              />
              <SliderField
                label="Border Width"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderWidth?.replace("px", "") || "1")}
                onChange={(v: number) => updateStyles({ borderWidth: `${v}px` })}
                min={0}
                max={5}
                step={1}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Layers className="h-3.5 w-3.5" />
                Spacing
              </label>
              <SliderField
                label="Gap Between Projects"
                icon={<ArrowDown className="h-3.5 w-3.5" />}
                value={parseFloat((projectsData as any).gap?.replace("px", "") || "16")}
                onChange={(v: number) => updateData({ ...projectsData, gap: `${v}px` } as any)}
                min={8}
                max={48}
                step={4}
                unit="px"
              />
              <SliderField
                label="Card Padding"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.padding?.replace("px", "") || "16")}
                onChange={(v: number) => updateStyles({ padding: `${v}px` })}
                min={8}
                max={48}
                step={4}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Sparkles className="h-3.5 w-3.5" />
                Effects
              </label>
              <SliderField
                label="Shadow"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.boxShadow?.replace("px", "") || "0")}
                onChange={(v: number) => updateStyles({ boxShadow: `${v}px ${v}px ${v * 2}px rgba(0,0,0,0.1)` })}
                min={0}
                max={50}
                step={2}
                unit="px"
              />
            </div>
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // Services component
  if (component.type === "services") {
    const servicesData = component as any;
    const updateData = (updates: any) => {
      updateComponent(component.id, { ...servicesData, ...updates });
    };

    const handleAddService = () => {
      const newService = { title: '', description: '', icon: '' };
      updateData({ services: [...(servicesData.services || []), newService] });
    };

    const handleRemoveService = (index: number) => {
      const newServices = (servicesData.services || []).filter((_: any, i: number) => i !== index);
      updateData({ services: newServices });
    };

    const handleUpdateService = (index: number, field: string, value: string) => {
      const newServices = [...(servicesData.services || [])];
      newServices[index] = { ...newServices[index], [field]: value };
      updateData({ services: newServices });
    };

    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Briefcase className="h-3.5 w-3.5" />
                Services
              </label>
              <button
                onClick={handleAddService}
                className="px-3 py-1.5 text-xs font-medium bg-[oklch(0.6500_0.22_25)] text-white rounded hover:bg-[oklch(0.6000_0.22_25)] transition-colors flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Service
              </button>
            </div>
            {(servicesData.services || []).map((service: any, index: number) => (
              <div key={index} className="p-4 bg-[oklch(0.9600_0.008_30)] rounded-lg border border-[oklch(0.9200_0.005_20)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[oklch(0.2200_0.015_20)]">Service #{index + 1}</span>
                  <button
                    onClick={() => handleRemoveService(index)}
                    className="p-1 hover:bg-[oklch(0.9200_0.005_20)] rounded transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-[oklch(0.5200_0.015_25)]" />
                  </button>
                </div>
                <InputField
                  label="Icon (Emoji or Symbol)"
                  value={service.icon || ""}
                  onChange={(v: string) => handleUpdateService(index, 'icon', v)}
                  placeholder="💼 or ⚡"
                />
                <InputField
                  label="Title"
                  value={service.title || ""}
                  onChange={(v: string) => handleUpdateService(index, 'title', v)}
                  placeholder="Service Name"
                />
                <InputField
                  label="Description"
                  value={service.description || ""}
                  onChange={(v: string) => handleUpdateService(index, 'description', v)}
                  placeholder="Service description..."
                  type="textarea"
                />
              </div>
            ))}
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Palette className="h-3.5 w-3.5" />
                Colors
              </label>
              <ColorPicker
                label="Title Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.color || designPalette.titleColor || "#000000"}
                onChange={(v: string) => updateStyles({ color: v })}
              />
              <ColorPicker
                label="Description Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.descriptionColor || designPalette.descriptionColor || "#666666"}
                onChange={(v: string) => updateStyles({ descriptionColor: v })}
              />
              <ColorPicker
                label="Icon Background"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.iconBackgroundColor || designPalette.primaryColor || "#000000"}
                onChange={(v: string) => updateStyles({ iconBackgroundColor: v })}
              />
              <ColorPicker
                label="Card Background"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.backgroundColor || "#ffffff"}
                onChange={(v: string) => updateStyles({ backgroundColor: v })}
              />
              <ColorPicker
                label="Border Color"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={styles.borderColor || "#e5e7eb"}
                onChange={(v: string) => updateStyles({ borderColor: v })}
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Maximize className="h-3.5 w-3.5" />
                Border & Radius
              </label>
              <SliderField
                label="Corner Radius"
                icon={<Maximize className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderRadius?.replace("px", "") || "12")}
                onChange={(v: number) => updateStyles({ borderRadius: `${v}px` })}
                min={0}
                max={50}
                step={1}
                unit="px"
              />
              <SliderField
                label="Border Width"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderWidth?.replace("px", "") || "1")}
                onChange={(v: number) => updateStyles({ borderWidth: `${v}px` })}
                min={0}
                max={5}
                step={1}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Layers className="h-3.5 w-3.5" />
                Spacing
              </label>
              <SliderField
                label="Gap Between Services"
                icon={<ArrowDown className="h-3.5 w-3.5" />}
                value={parseFloat((servicesData as any).gap?.replace("px", "") || "24")}
                onChange={(v: number) => updateData({ ...servicesData, gap: `${v}px` } as any)}
                min={8}
                max={48}
                step={4}
                unit="px"
              />
              <SliderField
                label="Card Padding"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.padding?.replace("px", "") || "24")}
                onChange={(v: number) => updateStyles({ padding: `${v}px` })}
                min={8}
                max={48}
                step={4}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Sparkles className="h-3.5 w-3.5" />
                Effects
              </label>
              <SliderField
                label="Shadow"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.boxShadow?.replace("px", "") || "0")}
                onChange={(v: number) => updateStyles({ boxShadow: `${v}px ${v}px ${v * 2}px rgba(0,0,0,0.1)` })}
                min={0}
                max={50}
                step={2}
                unit="px"
              />
            </div>
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // Pricing component
  if (component.type === "pricing") {
    const pricingData = component as any;
    const updateData = (updates: any) => {
      updateComponent(component.id, { ...pricingData, ...updates });
    };

    const handleAddPlan = () => {
      const newPlan = {
        name: '',
        price: '',
        period: '/month',
        description: '',
        features: [],
        buttonText: 'Get Started',
        buttonLink: '#',
        popular: false,
      };
      updateData({ plans: [...(pricingData.plans || []), newPlan] });
    };

    const handleRemovePlan = (index: number) => {
      const newPlans = (pricingData.plans || []).filter((_: any, i: number) => i !== index);
      updateData({ plans: newPlans });
    };

    const handleUpdatePlan = (index: number, field: string, value: any) => {
      const newPlans = [...(pricingData.plans || [])];
      newPlans[index] = { ...newPlans[index], [field]: value };
      updateData({ plans: newPlans });
    };

    const handleAddFeature = (planIndex: number) => {
      const newPlans = [...(pricingData.plans || [])];
      newPlans[planIndex].features = [...(newPlans[planIndex].features || []), { text: '' }];
      updateData({ plans: newPlans });
    };

    const handleUpdateFeature = (planIndex: number, featureIndex: number, text: string) => {
      const newPlans = [...(pricingData.plans || [])];
      newPlans[planIndex].features[featureIndex].text = text;
      updateData({ plans: newPlans });
    };

    const handleRemoveFeature = (planIndex: number, featureIndex: number) => {
      const newPlans = [...(pricingData.plans || [])];
      newPlans[planIndex].features = newPlans[planIndex].features.filter((_: any, i: number) => i !== featureIndex);
      updateData({ plans: newPlans });
    };

    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <DollarSign className="h-3.5 w-3.5" />
                Pricing Plans
              </label>
              <button
                onClick={handleAddPlan}
                className="px-3 py-1.5 text-xs font-medium bg-[oklch(0.6500_0.22_25)] text-white rounded hover:bg-[oklch(0.6000_0.22_25)] transition-colors flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Plan
              </button>
            </div>
            {(pricingData.plans || []).map((plan: any, index: number) => (
              <div key={index} className="p-4 bg-[oklch(0.9600_0.008_30)] rounded-lg border border-[oklch(0.9200_0.005_20)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[oklch(0.2200_0.015_20)]">Plan #{index + 1}</span>
                    <ToggleField
                      label="Popular"
                      checked={plan.popular || false}
                      onChange={(v: boolean) => handleUpdatePlan(index, 'popular', v)}
                    />
                  </div>
                  <button
                    onClick={() => handleRemovePlan(index)}
                    className="p-1 hover:bg-[oklch(0.9200_0.005_20)] rounded transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-[oklch(0.5200_0.015_25)]" />
                  </button>
                </div>
                <InputField
                  label="Plan Name"
                  value={plan.name || ""}
                  onChange={(v: string) => handleUpdatePlan(index, 'name', v)}
                  placeholder="Basic"
                />
                <div className="grid grid-cols-2 gap-2">
                  <InputField
                    label="Price"
                    value={plan.price || ""}
                    onChange={(v: string) => handleUpdatePlan(index, 'price', v)}
                    placeholder="29"
                  />
                  <InputField
                    label="Period"
                    value={plan.period || ""}
                    onChange={(v: string) => handleUpdatePlan(index, 'period', v)}
                    placeholder="/month"
                  />
                </div>
                <InputField
                  label="Description"
                  value={plan.description || ""}
                  onChange={(v: string) => handleUpdatePlan(index, 'description', v)}
                  placeholder="Plan description..."
                  type="textarea"
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-[oklch(0.2200_0.015_20)]">Features</label>
                    <button
                      onClick={() => handleAddFeature(index)}
                      className="px-2 py-1 text-xs bg-[oklch(0.9600_0.008_30)] rounded hover:bg-[oklch(0.9200_0.005_20)] transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  {(plan.features || []).map((feature: any, fIndex: number) => (
                    <div key={fIndex} className="flex items-center gap-2">
                      <InputField
                        label=""
                        value={feature.text || ""}
                        onChange={(v: string) => handleUpdateFeature(index, fIndex, v)}
                        placeholder="Feature text"
                      />
                      <button
                        onClick={() => handleRemoveFeature(index, fIndex)}
                        className="p-1 hover:bg-[oklch(0.9200_0.005_20)] rounded transition-colors"
                      >
                        <X className="h-3.5 w-3.5 text-[oklch(0.5200_0.015_25)]" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <InputField
                    label="Button Text"
                    value={plan.buttonText || ""}
                    onChange={(v: string) => handleUpdatePlan(index, 'buttonText', v)}
                    placeholder="Get Started"
                  />
                  <InputField
                    label="Button Link"
                    value={plan.buttonLink || ""}
                    onChange={(v: string) => handleUpdatePlan(index, 'buttonLink', v)}
                    placeholder="#"
                    type="url"
                  />
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Palette className="h-3.5 w-3.5" />
                Colors
              </label>
              <ColorPicker
                label="Title Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.color || designPalette.titleColor || "#000000"}
                onChange={(v: string) => updateStyles({ color: v })}
              />
              <ColorPicker
                label="Price Color"
                icon={<DollarSign className="h-3.5 w-3.5" />}
                value={styles.priceColor || designPalette.primaryColor || "#000000"}
                onChange={(v: string) => updateStyles({ priceColor: v })}
              />
              <ColorPicker
                label="Button Background"
                icon={<MousePointerClick className="h-3.5 w-3.5" />}
                value={styles.buttonColor || designPalette.primaryColor || "#000000"}
                onChange={(v: string) => updateStyles({ buttonColor: v })}
              />
              <ColorPicker
                label="Button Text Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.buttonTextColor || "#ffffff"}
                onChange={(v: string) => updateStyles({ buttonTextColor: v })}
              />
              <ColorPicker
                label="Card Background"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.backgroundColor || "#ffffff"}
                onChange={(v: string) => updateStyles({ backgroundColor: v })}
              />
              <ColorPicker
                label="Border Color"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={styles.borderColor || "#e5e7eb"}
                onChange={(v: string) => updateStyles({ borderColor: v })}
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Maximize className="h-3.5 w-3.5" />
                Border & Radius
              </label>
              <SliderField
                label="Corner Radius"
                icon={<Maximize className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderRadius?.replace("px", "") || "12")}
                onChange={(v: number) => updateStyles({ borderRadius: `${v}px` })}
                min={0}
                max={50}
                step={1}
                unit="px"
              />
              <SliderField
                label="Border Width"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderWidth?.replace("px", "") || "1")}
                onChange={(v: number) => updateStyles({ borderWidth: `${v}px` })}
                min={0}
                max={5}
                step={1}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Layers className="h-3.5 w-3.5" />
                Spacing
              </label>
              <SliderField
                label="Gap Between Plans"
                icon={<ArrowDown className="h-3.5 w-3.5" />}
                value={parseFloat((pricingData as any).gap?.replace("px", "") || "24")}
                onChange={(v: number) => updateData({ ...pricingData, gap: `${v}px` } as any)}
                min={8}
                max={48}
                step={4}
                unit="px"
              />
              <SliderField
                label="Card Padding"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.padding?.replace("px", "") || "32")}
                onChange={(v: number) => updateStyles({ padding: `${v}px` })}
                min={16}
                max={64}
                step={4}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Sparkles className="h-3.5 w-3.5" />
                Effects
              </label>
              <SliderField
                label="Shadow"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.boxShadow?.replace("px", "") || "0")}
                onChange={(v: number) => updateStyles({ boxShadow: `${v}px ${v}px ${v * 2}px rgba(0,0,0,0.1)` })}
                min={0}
                max={50}
                step={2}
                unit="px"
              />
            </div>
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // Review component
  if (component.type === "review") {
    const reviewData = component as any;
    const updateData = (updates: any) => {
      updateComponent(component.id, { ...reviewData, ...updates });
    };

    const handleAddReview = () => {
      const newReview = {
        name: '',
        role: '',
        company: '',
        rating: 5,
        comment: '',
        avatar: '',
        date: '',
      };
      updateData({ reviews: [...(reviewData.reviews || []), newReview] });
    };

    const handleRemoveReview = (index: number) => {
      const newReviews = (reviewData.reviews || []).filter((_: any, i: number) => i !== index);
      updateData({ reviews: newReviews });
    };

    const handleUpdateReview = (index: number, field: string, value: any) => {
      const newReviews = [...(reviewData.reviews || [])];
      newReviews[index] = { ...newReviews[index], [field]: value };
      updateData({ reviews: newReviews });
    };

    const handleImageUpload = (index: number, file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateReview(index, 'avatar', reader.result as string);
      };
      reader.readAsDataURL(file);
    };

    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Star className="h-3.5 w-3.5" />
                Reviews
              </label>
              <button
                onClick={handleAddReview}
                className="px-3 py-1.5 text-xs font-medium bg-[oklch(0.6500_0.22_25)] text-white rounded hover:bg-[oklch(0.6000_0.22_25)] transition-colors flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Review
              </button>
            </div>
            {(reviewData.reviews || []).map((review: any, index: number) => (
              <div key={index} className="p-4 bg-[oklch(0.9600_0.008_30)] rounded-lg border border-[oklch(0.9200_0.005_20)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[oklch(0.2200_0.015_20)]">Review #{index + 1}</span>
                  <button
                    onClick={() => handleRemoveReview(index)}
                    className="p-1 hover:bg-[oklch(0.9200_0.005_20)] rounded transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-[oklch(0.5200_0.015_25)]" />
                  </button>
                </div>
                <InputField
                  label="Name"
                  value={review.name || ""}
                  onChange={(v: string) => handleUpdateReview(index, 'name', v)}
                  placeholder="John Doe"
                />
                <InputField
                  label="Role"
                  value={review.role || ""}
                  onChange={(v: string) => handleUpdateReview(index, 'role', v)}
                  placeholder="CEO"
                />
                <InputField
                  label="Company"
                  value={review.company || ""}
                  onChange={(v: string) => handleUpdateReview(index, 'company', v)}
                  placeholder="Company Inc."
                />
                <div>
                  <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
                    <Star className="h-3.5 w-3.5" />
                    Rating
                  </label>
                  <select
                    value={review.rating || 5}
                    onChange={(e) => handleUpdateReview(index, 'rating', parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded"
                  >
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <InputField
                  label="Comment"
                  value={review.comment || ""}
                  onChange={(v: string) => handleUpdateReview(index, 'comment', v)}
                  placeholder="Great work!"
                  type="textarea"
                />
                <div>
                  <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Avatar
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(index, file);
                    }}
                    className="w-full text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Palette className="h-3.5 w-3.5" />
                Colors
              </label>
              <ColorPicker
                label="Title Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.color || designPalette.titleColor || "#000000"}
                onChange={(v: string) => updateStyles({ color: v })}
              />
              <ColorPicker
                label="Description Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.descriptionColor || designPalette.descriptionColor || "#666666"}
                onChange={(v: string) => updateStyles({ descriptionColor: v })}
              />
              <ColorPicker
                label="Star Color"
                icon={<Star className="h-3.5 w-3.5" />}
                value={styles.starColor || "#fbbf24"}
                onChange={(v: string) => updateStyles({ starColor: v })}
              />
              <ColorPicker
                label="Background Color"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.backgroundColor || "#ffffff"}
                onChange={(v: string) => updateStyles({ backgroundColor: v })}
              />
              <ColorPicker
                label="Border Color"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={styles.borderColor || "#e5e7eb"}
                onChange={(v: string) => updateStyles({ borderColor: v })}
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Maximize className="h-3.5 w-3.5" />
                Border & Radius
              </label>
              <SliderField
                label="Corner Radius"
                icon={<Maximize className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderRadius?.replace("px", "") || "12")}
                onChange={(v: number) => updateStyles({ borderRadius: `${v}px` })}
                min={0}
                max={50}
                step={1}
                unit="px"
              />
              <SliderField
                label="Border Width"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderWidth?.replace("px", "") || "1")}
                onChange={(v: number) => updateStyles({ borderWidth: `${v}px` })}
                min={0}
                max={5}
                step={1}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Layers className="h-3.5 w-3.5" />
                Spacing
              </label>
              <SliderField
                label="Gap Between Reviews"
                icon={<ArrowDown className="h-3.5 w-3.5" />}
                value={parseFloat((reviewData as any).gap?.replace("px", "") || "24")}
                onChange={(v: number) => updateData({ ...reviewData, gap: `${v}px` } as any)}
                min={8}
                max={48}
                step={4}
                unit="px"
              />
              <SliderField
                label="Card Padding"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.padding?.replace("px", "") || "24")}
                onChange={(v: number) => updateStyles({ padding: `${v}px` })}
                min={8}
                max={48}
                step={4}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Sparkles className="h-3.5 w-3.5" />
                Effects
              </label>
              <SliderField
                label="Shadow"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.boxShadow?.replace("px", "") || "0")}
                onChange={(v: number) => updateStyles({ boxShadow: `${v}px ${v}px ${v * 2}px rgba(0,0,0,0.1)` })}
                min={0}
                max={50}
                step={2}
                unit="px"
              />
            </div>
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // Languages component
  if (component.type === "languages") {
    const langData = component as any;
    const updateData = (updates: any) => {
      updateComponent(component.id, { ...langData, ...updates });
    };

    const handleAddLanguage = (name: string, level: string) => {
      if (name.trim() && !langData.languages.some((l: any) => l.name.toLowerCase() === name.trim().toLowerCase())) {
        updateData({ languages: [...(langData.languages || []), { name: name.trim(), level }] });
      }
    };

    const handleRemoveLanguage = (index: number) => {
      const newLangs = langData.languages.filter((_: any, i: number) => i !== index);
      updateData({ languages: newLangs });
    };

    const handleUpdateLanguage = (index: number, field: string, value: string) => {
      const newLangs = [...(langData.languages || [])];
      newLangs[index] = { ...newLangs[index], [field]: value };
      updateData({ languages: newLangs });
    };

    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Languages className="h-3.5 w-3.5" />
                Languages
              </label>
              <div className="flex gap-2">
                <InputField
                  label=""
                  value=""
                  onChange={(v: string) => {
                    if (v && v.includes(',')) {
                      v.split(',').forEach(lang => handleAddLanguage(lang.trim(), 'Fluent'));
                    }
                  }}
                  onKeyDown={(e: any) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLanguage(e.target.value, 'Fluent');
                      e.target.value = '';
                    }
                  }}
                  placeholder="Type language and press Enter (or comma-separated)"
                />
              </div>
              {(langData.languages || []).length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-[oklch(0.9600_0.008_30)] rounded-lg border border-[oklch(0.9200_0.005_20)]">
                  {(langData.languages || []).map((lang: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-[oklch(0.9200_0.005_20)]">
                      <InputField
                        label=""
                        value={lang.name || ""}
                        onChange={(v: string) => handleUpdateLanguage(index, 'name', v)}
                        placeholder="Language"
                      />
                      <select
                        value={lang.level || 'Fluent'}
                        onChange={(e) => handleUpdateLanguage(index, 'level', e.target.value)}
                        className="text-xs border-0 bg-transparent"
                      >
                        <option value="Fluent">Fluent</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Basic">Basic</option>
                      </select>
                      <button
                        onClick={() => handleRemoveLanguage(index)}
                        className="p-0.5 hover:bg-[oklch(0.9600_0.008_30)] rounded transition-colors"
                      >
                        <X className="h-3 w-3 text-[oklch(0.5200_0.015_25)]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Palette className="h-3.5 w-3.5" />
                Colors
              </label>
              <ColorPicker
                label="Text Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.color || designPalette.titleColor || "#000000"}
                onChange={(v: string) => updateStyles({ color: v })}
              />
              <ColorPicker
                label="Background Color"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.backgroundColor || "#ffffff"}
                onChange={(v: string) => updateStyles({ backgroundColor: v })}
              />
              <ColorPicker
                label="Border Color"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={styles.borderColor || "#e5e7eb"}
                onChange={(v: string) => updateStyles({ borderColor: v })}
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Maximize className="h-3.5 w-3.5" />
                Border & Radius
              </label>
              <SliderField
                label="Corner Radius"
                icon={<Maximize className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderRadius?.replace("px", "") || "24")}
                onChange={(v: number) => updateStyles({ borderRadius: `${v}px` })}
                min={0}
                max={50}
                step={1}
                unit="px"
              />
              <SliderField
                label="Border Width"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderWidth?.replace("px", "") || "1")}
                onChange={(v: number) => updateStyles({ borderWidth: `${v}px` })}
                min={0}
                max={5}
                step={1}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Layers className="h-3.5 w-3.5" />
                Spacing
              </label>
              <SliderField
                label="Gap Between Languages"
                icon={<ArrowDown className="h-3.5 w-3.5" />}
                value={parseFloat((langData as any).gap?.replace("px", "") || "8")}
                onChange={(v: number) => updateData({ ...langData, gap: `${v}px` } as any)}
                min={4}
                max={24}
                step={2}
                unit="px"
              />
              <SliderField
                label="Padding"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.padding?.replace("px", "") || "8")}
                onChange={(v: number) => updateStyles({ padding: `${v}px 16px` })}
                min={4}
                max={24}
                step={2}
                unit="px"
              />
            </div>
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // Award component
  if (component.type === "award") {
    const awardData = component as any;
    const updateData = (updates: any) => {
      updateComponent(component.id, { ...awardData, ...updates });
    };

    const handleAddAward = () => {
      const newAward = {
        title: '',
        organization: '',
        year: '',
        description: '',
        image: '',
      };
      updateData({ awards: [...(awardData.awards || []), newAward] });
    };

    const handleRemoveAward = (index: number) => {
      const newAwards = (awardData.awards || []).filter((_: any, i: number) => i !== index);
      updateData({ awards: newAwards });
    };

    const handleUpdateAward = (index: number, field: string, value: string) => {
      const newAwards = [...(awardData.awards || [])];
      newAwards[index] = { ...newAwards[index], [field]: value };
      updateData({ awards: newAwards });
    };

    const handleImageUpload = (index: number, file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateAward(index, 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    };

    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Trophy className="h-3.5 w-3.5" />
                Awards
              </label>
              <button
                onClick={handleAddAward}
                className="px-3 py-1.5 text-xs font-medium bg-[oklch(0.6500_0.22_25)] text-white rounded hover:bg-[oklch(0.6000_0.22_25)] transition-colors flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Award
              </button>
            </div>
            {(awardData.awards || []).map((award: any, index: number) => (
              <div key={index} className="p-4 bg-[oklch(0.9600_0.008_30)] rounded-lg border border-[oklch(0.9200_0.005_20)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[oklch(0.2200_0.015_20)]">Award #{index + 1}</span>
                  <button
                    onClick={() => handleRemoveAward(index)}
                    className="p-1 hover:bg-[oklch(0.9200_0.005_20)] rounded transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-[oklch(0.5200_0.015_25)]" />
                  </button>
                </div>
                <InputField
                  label="Title"
                  value={award.title || ""}
                  onChange={(v: string) => handleUpdateAward(index, 'title', v)}
                  placeholder="Award Title"
                />
                <div className="grid grid-cols-2 gap-2">
                  <InputField
                    label="Organization"
                    value={award.organization || ""}
                    onChange={(v: string) => handleUpdateAward(index, 'organization', v)}
                    placeholder="Organization"
                  />
                  <InputField
                    label="Year"
                    value={award.year || ""}
                    onChange={(v: string) => handleUpdateAward(index, 'year', v)}
                    placeholder="2024"
                  />
                </div>
                <InputField
                  label="Description"
                  value={award.description || ""}
                  onChange={(v: string) => handleUpdateAward(index, 'description', v)}
                  placeholder="Award description..."
                  type="textarea"
                />
                <div>
                  <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Award Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(index, file);
                    }}
                    className="w-full text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Palette className="h-3.5 w-3.5" />
                Colors
              </label>
              <ColorPicker
                label="Title Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.color || designPalette.titleColor || "#000000"}
                onChange={(v: string) => updateStyles({ color: v })}
              />
              <ColorPicker
                label="Description Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.descriptionColor || designPalette.descriptionColor || "#666666"}
                onChange={(v: string) => updateStyles({ descriptionColor: v })}
              />
              <ColorPicker
                label="Background Color"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.backgroundColor || "#ffffff"}
                onChange={(v: string) => updateStyles({ backgroundColor: v })}
              />
              <ColorPicker
                label="Border Color"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={styles.borderColor || "#e5e7eb"}
                onChange={(v: string) => updateStyles({ borderColor: v })}
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Maximize className="h-3.5 w-3.5" />
                Border & Radius
              </label>
              <SliderField
                label="Corner Radius"
                icon={<Maximize className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderRadius?.replace("px", "") || "12")}
                onChange={(v: number) => updateStyles({ borderRadius: `${v}px` })}
                min={0}
                max={50}
                step={1}
                unit="px"
              />
              <SliderField
                label="Border Width"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderWidth?.replace("px", "") || "1")}
                onChange={(v: number) => updateStyles({ borderWidth: `${v}px` })}
                min={0}
                max={5}
                step={1}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Layers className="h-3.5 w-3.5" />
                Spacing
              </label>
              <SliderField
                label="Gap Between Awards"
                icon={<ArrowDown className="h-3.5 w-3.5" />}
                value={parseFloat((awardData as any).gap?.replace("px", "") || "24")}
                onChange={(v: number) => updateData({ ...awardData, gap: `${v}px` } as any)}
                min={8}
                max={48}
                step={4}
                unit="px"
              />
              <SliderField
                label="Card Padding"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.padding?.replace("px", "") || "16")}
                onChange={(v: number) => updateStyles({ padding: `${v}px` })}
                min={8}
                max={48}
                step={4}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Sparkles className="h-3.5 w-3.5" />
                Effects
              </label>
              <SliderField
                label="Shadow"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.boxShadow?.replace("px", "") || "0")}
                onChange={(v: number) => updateStyles({ boxShadow: `${v}px ${v}px ${v * 2}px rgba(0,0,0,0.1)` })}
                min={0}
                max={50}
                step={2}
                unit="px"
              />
            </div>
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // Tools component
  if (component.type === "tools") {
    const toolsData = component as any;
    const updateData = (updates: any) => {
      updateComponent(component.id, { ...toolsData, ...updates });
    };

    const handleAddTool = (tool: string) => {
      if (tool.trim() && !toolsData.tools.includes(tool.trim())) {
        updateData({ tools: [...(toolsData.tools || []), tool.trim()] });
      }
    };

    const handleRemoveTool = (index: number) => {
      const newTools = toolsData.tools.filter((_: any, i: number) => i !== index);
      updateData({ tools: newTools });
    };

    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Wrench className="h-3.5 w-3.5" />
                Tools
              </label>
              <div className="flex gap-2">
                <InputField
                  label=""
                  value=""
                  onChange={(v: string) => {
                    if (v && v.includes(',')) {
                      v.split(',').forEach(tool => handleAddTool(tool.trim()));
                    }
                  }}
                  onKeyDown={(e: any) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTool(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  placeholder="Type tool and press Enter (or comma-separated)"
                />
              </div>
              {(toolsData.tools || []).length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-[oklch(0.9600_0.008_30)] rounded-lg border border-[oklch(0.9200_0.005_20)]">
                  {(toolsData.tools || []).map((tool: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-[oklch(0.9200_0.005_20)]">
                      <span className="text-xs">{tool}</span>
                      <button
                        onClick={() => handleRemoveTool(index)}
                        className="p-0.5 hover:bg-[oklch(0.9600_0.008_30)] rounded transition-colors"
                      >
                        <X className="h-3 w-3 text-[oklch(0.5200_0.015_25)]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Palette className="h-3.5 w-3.5" />
                Colors
              </label>
              <ColorPicker
                label="Text Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.color || designPalette.titleColor || "#000000"}
                onChange={(v: string) => updateStyles({ color: v })}
              />
              <ColorPicker
                label="Background Color"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.backgroundColor || "#ffffff"}
                onChange={(v: string) => updateStyles({ backgroundColor: v })}
              />
              <ColorPicker
                label="Border Color"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={styles.borderColor || "#e5e7eb"}
                onChange={(v: string) => updateStyles({ borderColor: v })}
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Maximize className="h-3.5 w-3.5" />
                Border & Radius
              </label>
              <SliderField
                label="Corner Radius"
                icon={<Maximize className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderRadius?.replace("px", "") || "24")}
                onChange={(v: number) => updateStyles({ borderRadius: `${v}px` })}
                min={0}
                max={50}
                step={1}
                unit="px"
              />
              <SliderField
                label="Border Width"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderWidth?.replace("px", "") || "1")}
                onChange={(v: number) => updateStyles({ borderWidth: `${v}px` })}
                min={0}
                max={5}
                step={1}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Layers className="h-3.5 w-3.5" />
                Spacing
              </label>
              <SliderField
                label="Gap Between Tools"
                icon={<ArrowDown className="h-3.5 w-3.5" />}
                value={parseFloat((toolsData as any).gap?.replace("px", "") || "8")}
                onChange={(v: number) => updateData({ ...toolsData, gap: `${v}px` } as any)}
                min={4}
                max={24}
                step={2}
                unit="px"
              />
              <SliderField
                label="Padding"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.padding?.replace("px", "") || "8")}
                onChange={(v: number) => updateStyles({ padding: `${v}px 20px` })}
                min={4}
                max={24}
                step={2}
                unit="px"
              />
            </div>
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // GitHub component
  if (component.type === "github") {
    const githubData = component as any;
    const updateData = (updates: any) => {
      updateComponent(component.id, { ...githubData, ...updates });
    };

    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <InputField
              label="GitHub Username"
              icon={<Github className="h-3.5 w-3.5" />}
              value={githubData.username || ""}
              onChange={(v: string) => updateData({ username: v })}
              placeholder="your-username"
            />
            <ToggleField
              label="Show Repository Stats"
              checked={githubData.showRepos || false}
              onChange={(v: boolean) => updateData({ showRepos: v })}
            />
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Palette className="h-3.5 w-3.5" />
                Colors
              </label>
              <ColorPicker
                label="Title Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.color || designPalette.titleColor || "#000000"}
                onChange={(v: string) => updateStyles({ color: v })}
              />
              <ColorPicker
                label="Description Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.descriptionColor || designPalette.descriptionColor || "#666666"}
                onChange={(v: string) => updateStyles({ descriptionColor: v })}
              />
              <ColorPicker
                label="Background Color"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.backgroundColor || "#ffffff"}
                onChange={(v: string) => updateStyles({ backgroundColor: v })}
              />
              <ColorPicker
                label="Border Color"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={styles.borderColor || "#e5e7eb"}
                onChange={(v: string) => updateStyles({ borderColor: v })}
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Maximize className="h-3.5 w-3.5" />
                Border & Radius
              </label>
              <SliderField
                label="Corner Radius"
                icon={<Maximize className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderRadius?.replace("px", "") || "12")}
                onChange={(v: number) => updateStyles({ borderRadius: `${v}px` })}
                min={0}
                max={50}
                step={1}
                unit="px"
              />
              <SliderField
                label="Border Width"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderWidth?.replace("px", "") || "1")}
                onChange={(v: number) => updateStyles({ borderWidth: `${v}px` })}
                min={0}
                max={5}
                step={1}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Layers className="h-3.5 w-3.5" />
                Spacing
              </label>
              <SliderField
                label="Padding"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.padding?.replace("px", "") || "24")}
                onChange={(v: number) => updateStyles({ padding: `${v}px` })}
                min={8}
                max={48}
                step={4}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Sparkles className="h-3.5 w-3.5" />
                Effects
              </label>
              <SliderField
                label="Shadow"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.boxShadow?.replace("px", "") || "0")}
                onChange={(v: number) => updateStyles({ boxShadow: `${v}px ${v}px ${v * 2}px rgba(0,0,0,0.1)` })}
                min={0}
                max={50}
                step={2}
                unit="px"
              />
            </div>
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // Spotify component
  if (component.type === "spotify") {
    const spotifyData = component as any;
    const updateData = (updates: any) => {
      updateComponent(component.id, { ...spotifyData, ...updates });
    };

    const playlists = spotifyData.playlists || (spotifyData.playlistUrl ? [{ url: spotifyData.playlistUrl, title: spotifyData.title || '' }] : []);

    const handleAddPlaylist = () => {
      const newPlaylists = [...playlists, { url: '', title: '' }];
      updateData({ playlists: newPlaylists });
    };

    const handleRemovePlaylist = (index: number) => {
      const newPlaylists = playlists.filter((_: any, i: number) => i !== index);
      updateData({ playlists: newPlaylists });
    };

    const handleUpdatePlaylist = (index: number, field: string, value: string) => {
      const newPlaylists = [...playlists];
      newPlaylists[index] = { ...newPlaylists[index], [field]: value };
      updateData({ playlists: newPlaylists });
    };

    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Music className="h-3.5 w-3.5" />
                Playlists
              </label>
              <div className="flex items-center gap-2">
                <SelectField
                  label=""
                  value={spotifyData.layout || "grid"}
                  onChange={(v: string) => updateData({ layout: v })}
                  options={[
                    { value: "grid", label: "Grid" },
                    { value: "list", label: "List" },
                  ]}
                />
                <button
                  onClick={handleAddPlaylist}
                  className="px-3 py-1.5 text-xs font-medium bg-[oklch(0.6500_0.22_25)] text-white rounded hover:bg-[oklch(0.6000_0.22_25)] transition-colors flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>
            </div>
            {playlists.map((playlist: any, index: number) => (
              <div key={index} className="p-4 bg-[oklch(0.9600_0.008_30)] rounded-lg border border-[oklch(0.9200_0.005_20)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[oklch(0.2200_0.015_20)]">Playlist #{index + 1}</span>
                  <button
                    onClick={() => handleRemovePlaylist(index)}
                    className="p-1 hover:bg-[oklch(0.9200_0.005_20)] rounded transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-[oklch(0.5200_0.015_25)]" />
                  </button>
                </div>
                <InputField
                  label="Playlist Title (Optional)"
                  value={playlist.title || ""}
                  onChange={(v: string) => handleUpdatePlaylist(index, 'title', v)}
                  placeholder="My Awesome Playlist"
                />
                <InputField
                  label="Spotify Playlist URL or ID"
                  value={playlist.url || ""}
                  onChange={(v: string) => handleUpdatePlaylist(index, 'url', v)}
                  placeholder="https://open.spotify.com/playlist/..."
                  type="url"
                />
              </div>
            ))}
            {playlists.length === 0 && (
              <div className="text-center py-8 text-sm text-[oklch(0.5200_0.015_25)]">
                Click "Add" to add a playlist
              </div>
            )}
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Palette className="h-3.5 w-3.5" />
                Colors
              </label>
              <ColorPicker
                label="Title Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.color || designPalette.titleColor || "#000000"}
                onChange={(v: string) => updateStyles({ color: v })}
              />
              <ColorPicker
                label="Description Color"
                icon={<Type className="h-3.5 w-3.5" />}
                value={styles.descriptionColor || designPalette.descriptionColor || "#666666"}
                onChange={(v: string) => updateStyles({ descriptionColor: v })}
              />
              <ColorPicker
                label="Background Color"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={styles.backgroundColor || "#ffffff"}
                onChange={(v: string) => updateStyles({ backgroundColor: v })}
              />
              <ColorPicker
                label="Border Color"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={styles.borderColor || "#e5e7eb"}
                onChange={(v: string) => updateStyles({ borderColor: v })}
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Maximize className="h-3.5 w-3.5" />
                Border & Radius
              </label>
              <SliderField
                label="Corner Radius"
                icon={<Maximize className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderRadius?.replace("px", "") || "12")}
                onChange={(v: number) => updateStyles({ borderRadius: `${v}px` })}
                min={0}
                max={50}
                step={1}
                unit="px"
              />
              <SliderField
                label="Border Width"
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                value={parseFloat(styles.borderWidth?.replace("px", "") || "1")}
                onChange={(v: number) => updateStyles({ borderWidth: `${v}px` })}
                min={0}
                max={5}
                step={1}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Layers className="h-3.5 w-3.5" />
                Spacing
              </label>
              <SliderField
                label="Gap Between Playlists"
                icon={<ArrowDown className="h-3.5 w-3.5" />}
                value={parseFloat((spotifyData as any).gap?.replace("px", "") || "24")}
                onChange={(v: number) => updateData({ ...spotifyData, gap: `${v}px` } as any)}
                min={8}
                max={48}
                step={4}
                unit="px"
              />
              <SliderField
                label="Padding"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.padding?.replace("px", "") || "16")}
                onChange={(v: number) => updateStyles({ padding: `${v}px` })}
                min={8}
                max={48}
                step={4}
                unit="px"
              />
            </div>
            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)]">
                <Sparkles className="h-3.5 w-3.5" />
                Effects
              </label>
              <SliderField
                label="Shadow"
                icon={<Layers className="h-3.5 w-3.5" />}
                value={parseFloat(styles.boxShadow?.replace("px", "") || "0")}
                onChange={(v: number) => updateStyles({ boxShadow: `${v}px ${v}px ${v * 2}px rgba(0,0,0,0.1)` })}
                min={0}
                max={50}
                step={2}
                unit="px"
              />
            </div>
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  // Layout component
  if (component.type === "layout") {
    const layoutData = component as LayoutComponentData;
    const hasBackground = layoutData.backgroundType !== "none";
    const updateData = (updates: Partial<LayoutComponentData>) => {
      updateComponent(component.id, { ...layoutData, ...updates });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateData({ backgroundImage: reader.result as string });
        };
        reader.readAsDataURL(file);
      }
    };

    const tabs = [
      {
        id: "content",
        label: "Content",
        icon: <Layout className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <InputField
              label="Title"
              icon={<Type className="h-3.5 w-3.5" />}
              value={layoutData.title || ""}
              onChange={(v: string) => updateData({ title: v })}
              placeholder="Layout title"
            />
            
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-2">
                <Layout className="h-3.5 w-3.5" />
                Columns
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "single", label: "1" },
                  { value: "double", label: "2" },
                  { value: "three", label: "3" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateData({ layoutType: opt.value as any })}
                    className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                      layoutData.layoutType === opt.value
                        ? "bg-[oklch(0.6500_0.22_25)] text-white border-[oklch(0.6500_0.22_25)]"
                        : "bg-white border-[oklch(0.9200_0.005_20)] hover:border-[oklch(0.6500_0.22_25)]/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-2">
                <Layout className="h-3.5 w-3.5" />
                Direction
              </label>
              <div className="flex gap-2">
                {[
                  { value: "vertical", label: "Vertical" },
                  { value: "horizontal", label: "Horizontal" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateData({ direction: opt.value as any })}
                    className={`flex-1 px-3 py-2 text-xs rounded-lg border transition-all ${
                      (layoutData.direction || "vertical") === opt.value
                        ? "bg-[oklch(0.6500_0.22_25)] text-white border-[oklch(0.6500_0.22_25)]"
                        : "bg-white border-[oklch(0.9200_0.005_20)] hover:border-[oklch(0.6500_0.22_25)]/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Column Widths - only show for horizontal multi-column layouts */}
            {layoutData.direction === "horizontal" && layoutData.layoutType !== "single" && (
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-2">
                  <Maximize className="h-3.5 w-3.5" />
                  Column Widths (must total 100%)
                </label>
                <div className="space-y-2">
                  {Array.from({ length: layoutData.layoutType === "double" ? 2 : 3 }, (_, i) => {
                    const columnWidths = layoutData.columnWidths || [];
                    const currentWidth = columnWidths[i] || (100 / (layoutData.layoutType === "double" ? 2 : 3));
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-[oklch(0.5200_0.015_25)] w-16">Col {i + 1}</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={currentWidth}
                          onChange={(e) => {
                            const newWidth = parseFloat(e.target.value) || 0;
                            const newColumnWidths = [...columnWidths];
                            newColumnWidths[i] = newWidth;
                            // Normalize to 100%
                            const total = newColumnWidths.reduce((sum, w) => sum + (w || 0), 0);
                            if (total > 0) {
                              const normalized = newColumnWidths.map((w) => (w / total) * 100);
                              updateData({ columnWidths: normalized });
                            } else {
                              updateData({ columnWidths: newColumnWidths });
                            }
                          }}
                          className="flex-1 px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                        />
                        <span className="text-xs text-[oklch(0.5200_0.015_25)] w-8">%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Column Alignments */}
            {layoutData.layoutType !== "single" && (
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-2">
                  <AlignLeft className="h-3.5 w-3.5" />
                  Column Alignment
                </label>
                <div className="space-y-2">
                  {Array.from({ length: layoutData.layoutType === "double" ? 2 : 3 }, (_, i) => {
                    const columnAlignments = layoutData.columnAlignments || [];
                    const currentAlignment = columnAlignments[i] || 'flex-start';
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-[oklch(0.5200_0.015_25)] w-16">Col {i + 1}</span>
                        <IconButtonGroup
                          options={[
                            { value: 'flex-start', label: 'Left', icon: AlignLeft },
                            { value: 'center', label: 'Center', icon: AlignCenter },
                            { value: 'flex-end', label: 'Right', icon: AlignRight },
                          ]}
                          value={currentAlignment}
                          onChange={(v: string) => {
                            const newColumnAlignments = [...columnAlignments];
                            newColumnAlignments[i] = v;
                            updateData({ columnAlignments: newColumnAlignments });
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-2">
                <Ruler className="h-3.5 w-3.5" />
                Height
              </label>
              <MetricField
                label=""
                icon={<Ruler className="h-3.5 w-3.5" />}
                value={layoutData.height || "auto"}
                onChange={(v: string) => updateData({ height: v })}
                allowedUnits={["px", "%", "vh", "rem", "em", "auto"]}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-2">
                <ImageIcon className="h-3.5 w-3.5" />
                Background
              </label>
              <SelectField
                label=""
                icon={<ImageIcon className="h-3.5 w-3.5" />}
                value={layoutData.backgroundType || "none"}
                onChange={(v: string) => updateData({ backgroundType: v as any })}
                options={[
                  { value: "none", label: "None" },
                  { value: "color", label: "Color" },
                  { value: "image", label: "Image" },
                  { value: "video", label: "Video (URL)" },
                ]}
              />
            </div>

            {layoutData.backgroundType === "color" && (
              <ColorPicker
                label="Background Color"
                icon={<Palette className="h-3.5 w-3.5" />}
                value={layoutData.backgroundColor || "#ffffff"}
                onChange={(v: string) => updateData({ backgroundColor: v })}
              />
            )}

            {layoutData.backgroundType === "image" && (
              <div className="space-y-2">
                <div>
                  <label className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
                    <Upload className="h-3.5 w-3.5" />
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-xs"
                  />
                </div>
                <InputField
                  label="Or Image URL"
                  icon={<Link2 className="h-3.5 w-3.5" />}
                  value={layoutData.backgroundImage || ""}
                  onChange={(v: string) => updateData({ backgroundImage: v })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}

            {layoutData.backgroundType === "video" && (
              <InputField
                label="Video URL"
                icon={<Video className="h-3.5 w-3.5" />}
                value={layoutData.backgroundVideo || ""}
                onChange={(v: string) => updateData({ backgroundVideo: v })}
                placeholder="https://example.com/video.mp4"
              />
            )}

            {hasBackground && (
              <>
                <ToggleField
                  label="Background Overlay"
                  icon={<Layers className="h-3.5 w-3.5" />}
                  checked={layoutData.backgroundOverlayEnabled || layoutData.backgroundOverlay || false}
                  onChange={(checked: boolean) => updateData({ backgroundOverlayEnabled: checked, backgroundOverlay: checked })}
                />
                {(layoutData.backgroundOverlayEnabled || layoutData.backgroundOverlay) && (
                  <>
                    <ColorPicker
                      label="Overlay Color"
                      icon={<Palette className="h-3.5 w-3.5" />}
                      value={layoutData.backgroundOverlayColor || "#000000"}
                      onChange={(v: string) => updateData({ backgroundOverlayColor: v })}
                    />
                    <SliderField
                      label="Overlay Opacity"
                      icon={<Layers className="h-3.5 w-3.5" />}
                      value={(layoutData.backgroundOverlayOpacity || 0.5) * 100}
                      onChange={(v: number) => updateData({ backgroundOverlayOpacity: v / 100 })}
                      min={0}
                      max={100}
                      step={5}
                      unit="%"
                    />
                  </>
                )}
              </>
            )}
          </div>
        ),
      },
      {
        id: "style",
        label: "Style",
        icon: <Palette className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <SliderField
              label="Padding"
              icon={<Layers className="h-3.5 w-3.5" />}
              value={parseFloat((styles.padding as string)?.replace("px", "") || "16")}
              onChange={(v: number) => updateStyles({ padding: `${v}px` })}
              min={0}
              max={100}
              step={4}
              unit="px"
            />
            <SliderField
              label="Border Radius"
              icon={<Layers className="h-3.5 w-3.5" />}
              value={parseFloat((styles.borderRadius as string)?.replace("px", "") || "0")}
              onChange={(v: number) => updateStyles({ borderRadius: `${v}px` })}
              min={0}
              max={50}
              step={2}
              unit="px"
            />
          </div>
        ),
      },
    ];

    return <TabbedPanel tabs={tabs} defaultTab="content" />;
  }

  return null;
}

