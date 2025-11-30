"use client";

import React from "react";
import { ComponentData, ProfilePhotoComponentData, SocialMediaComponentData } from "@/lib/editor-state";
import { useEditorStore } from "@/stores/editor-v2/store";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  Image as ImageIcon,
  Video,
  Type,
  MousePointerClick,
  Briefcase,
  Award,
  Users,
  Code,
  Share2,
  Plus,
  Link2,
  UploadCloud,
  Trash2,
  Globe,
  Layout,
  Minus,
} from "lucide-react";
import { Tooltip } from "../tooltip";

export function ContentPanel({ component }: { component: ComponentData }) {
  const { updateComponent } = useEditorStore();

  // Text components (header, text)
  if (component.type === "header" || component.type === "text") {
    const textData = component as any;
    return (
      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Type className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            Content
          </h3>
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Text</label>
          <textarea
            value={textData.content || ""}
            onChange={(e) =>
              updateComponent(component.id, { ...component, content: e.target.value } as any)
            }
            className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)] resize-none"
            rows={4}
            placeholder="Enter your text here..."
          />
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Alignment</label>
          <div className="flex items-center gap-1 bg-[oklch(0.9600_0.008_30)] rounded-lg p-1">
            {([
              { value: "left", icon: AlignLeft, label: "Left" },
              { value: "center", icon: AlignCenter, label: "Center" },
              { value: "right", icon: AlignRight, label: "Right" },
            ] as const).map(({ value, icon: Icon, label }) => (
              <Tooltip key={value} content={label}>
                <button
                  onClick={() =>
                    updateComponent(component.id, { ...component, alignment: value } as any)
                  }
                  className={`flex-1 p-2 rounded transition-all ${
                    textData.alignment === value
                      ? "bg-white text-[oklch(0.6500_0.22_25)] shadow-sm"
                      : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
                  }`}
                >
                  <Icon className="h-4 w-4 mx-auto" />
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Button component
  if (component.type === "button") {
    const buttonData = component as any;
    const buttons = buttonData.buttons || [{ text: "", link: "", variant: "default" }];
    
    return (
      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <MousePointerClick className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            Buttons
          </h3>
        </div>
        {buttons.map((btn: any, index: number) => (
          <div key={index} className="space-y-2 p-3 border border-[oklch(0.9200_0.005_20)] rounded-lg">
            <div>
              <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Button Text</label>
              <input
                type="text"
                value={btn.text || ""}
                onChange={(e) => {
                  const newButtons = [...buttons];
                  newButtons[index] = { ...btn, text: e.target.value };
                  updateComponent(component.id, { ...component, buttons: newButtons } as any);
                }}
                className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                placeholder="Click me"
              />
            </div>
            <div>
              <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Link URL</label>
              <input
                type="text"
                value={btn.link || ""}
                onChange={(e) => {
                  const newButtons = [...buttons];
                  newButtons[index] = { ...btn, link: e.target.value };
                  updateComponent(component.id, { ...component, buttons: newButtons } as any);
                }}
                className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                placeholder="https://..."
              />
            </div>
          </div>
        ))}
        <button
          onClick={() => {
            const newButtons = [...buttons, { text: "", link: "", variant: "default" }];
            updateComponent(component.id, { ...component, buttons: newButtons } as any);
          }}
          className="w-full px-3 py-2 text-xs font-medium text-[oklch(0.6500_0.22_25)] border border-[oklch(0.6500_0.22_25)] rounded hover:bg-[oklch(0.6500_0.22_25)]/5 transition-colors"
        >
          + Add Button
        </button>
      </div>
    );
  }

  // Image component
  if (component.type === "image") {
    const imageData = component as any;
    return (
      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <ImageIcon className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            Image
          </h3>
        </div>
        {imageData.src && (
          <div className="w-full h-32 border border-[oklch(0.9200_0.005_20)] rounded-lg overflow-hidden bg-[oklch(0.9600_0.008_30)] flex items-center justify-center">
            <img src={imageData.src} alt={imageData.alt || ""} className="max-w-full max-h-full object-contain" />
          </div>
        )}
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Image URL</label>
          <input
            type="text"
            value={imageData.src || ""}
            onChange={(e) =>
              updateComponent(component.id, { ...component, src: e.target.value } as any)
            }
            className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Alt Text</label>
          <input
            type="text"
            value={imageData.alt || ""}
            onChange={(e) =>
              updateComponent(component.id, { ...component, alt: e.target.value } as any)
            }
            className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
            placeholder="Image description"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64String = reader.result as string;
                updateComponent(component.id, { ...component, src: base64String } as any);
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
          Upload Image
        </label>
      </div>
    );
  }

  // Profile photo component
  if (component.type === "profile-photo") {
    const photoData = component as ProfilePhotoComponentData;
    const fileInputId = `profile-photo-upload-${component.id}`;

    const handleUpload = (file?: File) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        updateComponent(component.id, {
          ...(component as any),
          image: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    };

    return (
      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            Profile Photo
          </h3>
        </div>

        <div className="w-full border border-[oklch(0.9200_0.005_20)] rounded-2xl bg-[oklch(0.9700_0.01_20)] p-4 flex items-center justify-center">
          {photoData.image ? (
            <img
              src={photoData.image}
              alt="Profile"
              className="max-h-48 rounded-2xl object-cover"
            />
          ) : (
            <div className="text-center text-[oklch(0.5200_0.015_25)] text-xs">
              Upload an image to personalize this block.
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor={fileInputId}
            className="flex-1 px-3 py-2 text-sm font-medium text-center rounded-lg border border-[oklch(0.6500_0.22_25)] text-[oklch(0.6500_0.22_25)] hover:bg-[oklch(0.6500_0.22_25)]/5 transition cursor-pointer"
          >
            Upload Image
          </label>
          {photoData.image && (
            <button
              onClick={() =>
                updateComponent(component.id, { ...(component as any), image: "" })
              }
              className="px-3 py-2 text-xs font-medium text-[oklch(0.5500_0.26_15)] border border-[oklch(0.9200_0.005_20)] rounded-lg hover:bg-[oklch(0.9600_0.008_30)] transition"
            >
              Remove
            </button>
          )}
        </div>

        <input
          id={fileInputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files?.[0])}
        />

        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
            Alignment
          </label>
          <div className="flex items-center gap-1 bg-[oklch(0.9600_0.008_30)] rounded-lg p-1">
            {[
              { value: "left", icon: AlignLeft, label: "Left" },
              { value: "center", icon: AlignCenter, label: "Center" },
              { value: "right", icon: AlignRight, label: "Right" },
            ].map(({ value, icon: Icon, label }) => (
              <Tooltip key={value} content={label}>
                <button
                  onClick={() =>
                    updateComponent(component.id, {
                      ...(component as any),
                      alignment: value,
                    })
                  }
                  className={`flex-1 p-2 rounded transition-all ${
                    (photoData.alignment || "center") === value
                      ? "bg-white text-[oklch(0.6500_0.22_25)] shadow-sm"
                      : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
                  }`}
                >
                  <Icon className="h-4 w-4 mx-auto" />
                </button>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
              Shape
            </label>
            <div className="flex items-center gap-1 bg-[oklch(0.9600_0.008_30)] rounded-lg p-1">
              {[
                { value: "full", label: "Circle" },
                { value: "small", label: "Rounded" },
                { value: "none", label: "Square" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() =>
                    updateComponent(component.id, { ...(component as any), rounded: value })
                  }
                  className={`flex-1 px-2 py-1.5 text-[11px] rounded ${
                    (photoData.rounded || "full") === value
                      ? "bg-white text-[oklch(0.6500_0.22_25)] shadow-sm"
                      : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
              Size
            </label>
            <div className="flex items-center gap-1 bg-[oklch(0.9600_0.008_30)] rounded-lg p-1">
              {[
                { value: "sm", label: "Small" },
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() =>
                    updateComponent(component.id, { ...(component as any), size: value })
                  }
                  className={`flex-1 px-2 py-1.5 text-[11px] rounded ${
                    (photoData.size || "md") === value
                      ? "bg-white text-[oklch(0.6500_0.22_25)] shadow-sm"
                      : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
              Online Badge
            </p>
            <p className="text-[11px] text-[oklch(0.5200_0.015_25)]">
              Toggle presence indicator
            </p>
          </div>
          <button
            onClick={() =>
              updateComponent(component.id, {
                ...(component as any),
                showBadge: !(photoData.showBadge ?? true),
              })
            }
            className={`w-12 h-6 rounded-full transition-colors ${
              photoData.showBadge ?? true
                ? "bg-[oklch(0.6500_0.22_25)]"
                : "bg-[oklch(0.9200_0.005_20)]"
            }`}
          >
            <span
              className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${
                photoData.showBadge ?? true ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {(photoData.showBadge ?? true) && (
          <div>
            <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
              Badge Color
            </label>
            <input
              type="color"
              value={photoData.badgeColor || "#22c55e"}
              onChange={(e) =>
                updateComponent(component.id, {
                  ...(component as any),
                  badgeColor: e.target.value,
                })
              }
              className="w-full h-10 rounded-lg border border-[oklch(0.9200_0.005_20)]"
            />
          </div>
        )}
      </div>
    );
  }

  // Social media component
  if (component.type === "social-media") {
    const socialData = component as SocialMediaComponentData;
    const links = socialData.links || [];

    const updateLinks = (next: SocialMediaComponentData["links"]) =>
      updateComponent(component.id, { ...(component as any), links: next });

    const updateLink = (index: number, updates: Partial<SocialMediaComponentData["links"][number]>) => {
      updateLinks(links.map((link, i) => (i === index ? { ...link, ...updates } : link)));
    };

    const handleLinkChange = (index: number, field: "platform" | "url", value: string) => {
      updateLink(index, { [field]: value } as any);
    };

    const handleAddLink = () => {
      updateLinks([
        ...links,
        {
          platform: "Social Platform",
          url: "https://",
        },
      ]);
    };

    const handleRemoveLink = (index: number) => {
      updateLinks(links.filter((_, i) => i !== index));
    };

    const segmentationButton = (
      value: string,
      label: React.ReactNode,
      current: string | undefined,
      field: keyof SocialMediaComponentData
    ) => (
      <button
        key={value}
        onClick={() =>
          updateComponent(component.id, {
            ...(component as any),
            [field]: value,
          })
        }
        className={`flex-1 px-2 py-1.5 text-[11px] rounded-lg ${
          (current || "") === value
            ? "bg-white text-[oklch(0.6500_0.22_25)] shadow-sm"
            : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
        }`}
      >
        {label}
      </button>
    );

    return (
      <div className="bg-white rounded-2xl border border-[oklch(0.9200_0.005_20)] p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            Social Media
          </h3>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            Layout
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[oklch(0.9600_0.008_30)] rounded-lg p-1 flex items-center gap-1">
              {[{ v: "left", icon: AlignLeft }, { v: "center", icon: AlignCenter }, { v: "right", icon: AlignRight }].map(
                ({ v, icon: Icon }) => (
                  <Tooltip key={v} content={`Align ${v}`}>
                    <button
                      onClick={() =>
                        updateComponent(component.id, {
                          ...(component as any),
                          alignment: v as SocialMediaComponentData["alignment"],
                        })
                      }
                      className={`flex-1 py-1.5 rounded-lg ${
                        (socialData.alignment || "center") === v
                          ? "bg-white text-[oklch(0.6500_0.22_25)] shadow-sm"
                          : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
                      }`}
                    >
                      <Icon className="h-4 w-4 mx-auto" />
                    </button>
                  </Tooltip>
                )
              )}
            </div>
            <div className="flex-1 bg-[oklch(0.9600_0.008_30)] rounded-lg p-1 flex items-center gap-1">
              {["horizontal", "vertical"].map((value) =>
                segmentationButton(value, value === "horizontal" ? "Row" : "Column", socialData.arrangement, "arrangement")
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[oklch(0.9600_0.008_30)] rounded-lg p-1 flex items-center gap-1">
              {["icons-only", "icons-text", "text-only"].map((value) =>
                segmentationButton(
                  value,
                  value === "icons-text" ? "Icon + Text" : value.replace("-", " "),
                  socialData.displayMode,
                  "displayMode"
                )
              )}
            </div>
            <div className="bg-[oklch(0.9600_0.008_30)] rounded-lg p-1 flex items-center gap-1">
              {["sm", "md", "lg"].map((value) =>
                segmentationButton(value, value.toUpperCase(), socialData.size, "size")
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[oklch(0.9600_0.008_30)] rounded-lg p-1 flex items-center gap-1">
              {["filled", "outline"].map((value) =>
                segmentationButton(value, value === "filled" ? "Filled" : "Outline", socialData.buttonStyle, "buttonStyle")
              )}
            </div>
            <div className="bg-[oklch(0.9600_0.008_30)] rounded-lg p-1 flex items-center gap-1">
              {["pill", "rounded", "square"].map((value) =>
                segmentationButton(value, value === "pill" ? "Pill" : value, socialData.shape, "shape")
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
              Icon Layout
            </label>
            <div className="bg-[oklch(0.9600_0.008_30)] rounded-lg p-1 flex items-center gap-1">
              {[
                { value: "inline", label: "Inline" },
                { value: "stacked", label: "Stacked" },
              ].map(({ value, label }) =>
                segmentationButton(value, label, socialData.iconOrientation, "iconOrientation")
              )}
            </div>
          </div>

        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">
            Line Wrapping
          </label>
          <div className="bg-[oklch(0.9600_0.008_30)] rounded-lg p-1 flex items-center gap-1">
            {[
              { value: "auto", label: "Wrap" },
              { value: "single", label: "Single line" },
            ].map(({ value, label }) =>
              segmentationButton(value, label, socialData.lineMode, "lineMode")
            )}
          </div>
        </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Background", field: "backgroundColor", value: socialData.backgroundColor || "#ffffff" },
            { label: "Icon Color", field: "iconColor", value: socialData.iconColor || "#0f172a" },
            { label: "Text Color", field: "textColor", value: socialData.textColor || "#0f172a" },
          ].map(({ label, field, value }) => (
            <div key={field}>
              <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">{label}</label>
              <input
                type="color"
                value={value}
                onChange={(e) =>
                  updateComponent(component.id, {
                    ...(component as any),
                    [field]: e.target.value,
                  })
                }
                className="w-full h-10 rounded-lg border border-[oklch(0.9200_0.005_20)] bg-white"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
              Social Accounts
            </p>
            <p className="text-[11px] text-[oklch(0.5200_0.015_25)]">
              Add platforms you want to showcase
            </p>
          </div>
          <button
            onClick={handleAddLink}
            className="inline-flex items-center gap-1 text-xs font-medium text-[oklch(0.6500_0.22_25)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>

        {links.length === 0 ? (
          <div className="border border-dashed border-[oklch(0.9200_0.005_20)] rounded-xl py-6 px-4 text-center text-xs text-[oklch(0.5200_0.015_25)]">
            No social accounts yet. Use the add button to create one.
          </div>
        ) : (
          <div className="space-y-2">
            {links.map((link, index) => (
              <div key={`${link.platform}-${index}`} className="p-3 border border-[oklch(0.9200_0.005_20)] rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => handleLinkChange(index, "platform", e.target.value)}
                    className="flex-1 text-sm px-2 py-1.5 rounded-lg border border-[oklch(0.9200_0.005_20)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                    placeholder="Platform label"
                  />
                  <button
                    onClick={() => handleRemoveLink(index)}
                    className="p-2 rounded-lg border border-transparent hover:border-[oklch(0.9200_0.005_20)] text-[oklch(0.5500_0.26_15)] transition"
                    title="Remove account"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                  className="w-full text-xs px-2 py-1.5 rounded-lg border border-[oklch(0.9200_0.005_20)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                  placeholder="https://..."
                />
                <div className="flex items-center gap-3 bg-[oklch(0.9700_0.01_20)] rounded-lg p-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-[11px] text-[oklch(0.5200_0.015_25)] flex-shrink-0">
                      Custom Icon
                    </span>
                    {link.customIcon ? (
                      <img
                        src={link.customIcon}
                        alt="Custom icon"
                        className="w-7 h-7 object-contain rounded bg-white shadow-sm border border-[oklch(0.9200_0.005_20)]"
                      />
                    ) : (
                      <span className="text-[11px] text-[oklch(0.5200_0.015_25)]">
                        None
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <label
                      htmlFor={`${component.id}-custom-icon-${index}`}
                      className="p-2 rounded-lg border border-transparent hover:border-[oklch(0.9200_0.005_20)] text-[oklch(0.6500_0.22_25)] cursor-pointer transition"
                      title="Upload icon"
                    >
                      <UploadCloud className="h-4 w-4" />
                    </label>
                    {link.customIcon && (
                      <button
                        onClick={() => updateLink(index, { customIcon: "" })}
                        className="p-2 rounded-lg border border-transparent hover:border-[oklch(0.9200_0.005_20)] text-[oklch(0.5500_0.26_15)] transition"
                        title="Clear icon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <input
                    id={`${component.id}-custom-icon-${index}`}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        updateLink(index, { customIcon: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Video component
  if (component.type === "video") {
    const videoData = component as any;
    return (
      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Video className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            Video
          </h3>
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Embed URL</label>
          <input
            type="text"
            value={videoData.embedUrl || ""}
            onChange={(e) =>
              updateComponent(component.id, { ...component, embedUrl: e.target.value } as any)
            }
            className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
            placeholder="https://youtube.com/embed/..."
          />
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Title</label>
          <input
            type="text"
            value={videoData.title || ""}
            onChange={(e) =>
              updateComponent(component.id, { ...component, title: e.target.value } as any)
            }
            className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
            placeholder="Video title"
          />
        </div>
      </div>
    );
  }

  // Embed component
  if (component.type === "embed") {
    const embedData = component as any;
    return (
      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            Embed
          </h3>
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">URL</label>
          <input
            type="text"
            value={embedData.url || ""}
            onChange={(e) =>
              updateComponent(component.id, { ...component, url: e.target.value } as any)
            }
            className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Title (Optional)</label>
          <input
            type="text"
            value={embedData.title || ""}
            onChange={(e) =>
              updateComponent(component.id, { ...component, title: e.target.value } as any)
            }
            className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
            placeholder="My Embed"
          />
        </div>
      </div>
    );
  }

  // HTML component
  if (component.type === "html") {
    const htmlData = component as any;
    return (
      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Code className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            HTML Code
          </h3>
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Code</label>
          <textarea
            value={htmlData.code || ""}
            onChange={(e) =>
              updateComponent(component.id, { ...component, code: e.target.value } as any)
            }
            className="w-full px-3 py-2 text-sm font-mono border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)] resize-none bg-[oklch(0.9700_0.01_20)]"
            rows={10}
            placeholder="<div>Hello World</div>"
          />
        </div>
      </div>
    );
  }

  // Spacer component
  if (component.type === "spacer") {
    const spacerData = component as any;
    return (
      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Minus className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            Spacer
          </h3>
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Height</label>
          <input
            type="text"
            value={spacerData.height || "2rem"}
            onChange={(e) =>
              updateComponent(component.id, { ...component, height: e.target.value } as any)
            }
            className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
            placeholder="e.g. 2rem, 50px"
          />
        </div>
      </div>
    );
  }

  // Divider component
  if (component.type === "divider") {
    const dividerData = component as any;
    return (
      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Minus className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            Divider
          </h3>
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={dividerData.color || "#e2e8f0"}
              onChange={(e) =>
                updateComponent(component.id, { ...component, color: e.target.value } as any)
              }
              className="w-10 h-10 rounded border border-[oklch(0.9200_0.005_20)] cursor-pointer"
            />
            <input
              type="text"
              value={dividerData.color || "#e2e8f0"}
              onChange={(e) =>
                updateComponent(component.id, { ...component, color: e.target.value } as any)
              }
              className="flex-1 px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Thickness</label>
          <input
            type="range"
            min="1"
            max="10"
            value={parseInt(dividerData.thickness || "1")}
            onChange={(e) =>
              updateComponent(component.id, { ...component, thickness: `${e.target.value}px` } as any)
            }
            className="w-full"
          />
          <div className="text-right text-xs text-[oklch(0.5200_0.015_25)]">{dividerData.thickness || "1px"}</div>
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Style</label>
          <div className="flex items-center gap-1 bg-[oklch(0.9600_0.008_30)] rounded-lg p-1">
            {["solid", "dashed", "dotted"].map((style) => (
              <button
                key={style}
                onClick={() =>
                  updateComponent(component.id, { ...component, style } as any)
                }
                className={`flex-1 px-2 py-1.5 text-[11px] rounded capitalize ${
                  (dividerData.style || "solid") === style
                    ? "bg-white text-[oklch(0.6500_0.22_25)] shadow-sm"
                    : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Layout component
  if (component.type === "layout") {
    const layoutData = component as any;
    return (
      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Layout className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            Layout Settings
          </h3>
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Columns</label>
          <div className="flex items-center gap-1 bg-[oklch(0.9600_0.008_30)] rounded-lg p-1">
            {[
              { value: "single", label: "1 Col" },
              { value: "double", label: "2 Cols" },
              { value: "four", label: "4 Cols" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() =>
                  updateComponent(component.id, { ...component, layoutType: opt.value } as any)
                }
                className={`flex-1 px-2 py-1.5 text-[11px] rounded ${
                  (layoutData.layoutType || "single") === opt.value
                    ? "bg-white text-[oklch(0.6500_0.22_25)] shadow-sm"
                    : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Direction</label>
          <div className="flex items-center gap-1 bg-[oklch(0.9600_0.008_30)] rounded-lg p-1">
            {[
              { value: "horizontal", label: "Horizontal" },
              { value: "vertical", label: "Vertical" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() =>
                  updateComponent(component.id, { ...component, direction: opt.value } as any)
                }
                className={`flex-1 px-2 py-1.5 text-[11px] rounded ${
                  (layoutData.direction || "vertical") === opt.value
                    ? "bg-white text-[oklch(0.6500_0.22_25)] shadow-sm"
                    : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Profile component
  if (component.type === "profile") {
    const profileData = component as any;
    return (
      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            Profile
          </h3>
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Name</label>
          <input
            type="text"
            value={profileData.name || ""}
            onChange={(e) =>
              updateComponent(component.id, { ...component, name: e.target.value } as any)
            }
            className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Job Title</label>
          <input
            type="text"
            value={profileData.jobTitle || ""}
            onChange={(e) =>
              updateComponent(component.id, { ...component, jobTitle: e.target.value } as any)
            }
            className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
            placeholder="Software Engineer"
          />
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Headline</label>
          <input
            type="text"
            value={profileData.title || ""}
            onChange={(e) =>
              updateComponent(component.id, { ...component, title: e.target.value } as any)
            }
            className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
            placeholder="Building the future..."
          />
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Summary</label>
          <textarea
            value={profileData.summary || ""}
            onChange={(e) =>
              updateComponent(component.id, { ...component, summary: e.target.value } as any)
            }
            className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)] resize-none"
            rows={4}
            placeholder="Brief bio..."
          />
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Avatar URL</label>
          <input
            type="text"
            value={profileData.avatar || ""}
            onChange={(e) =>
              updateComponent(component.id, { ...component, avatar: e.target.value } as any)
            }
            className="w-full px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
            placeholder="https://..."
          />
        </div>
      </div>
    );
  }

  // Skills component
  if (component.type === "skills") {
    const skillsData = component as any;
    const skills = skillsData.skills || [];
    
    return (
      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            Skills
          </h3>
        </div>
        <div className="space-y-2">
          {skills.map((skill: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => {
                  const newSkills = [...skills];
                  newSkills[index] = e.target.value;
                  updateComponent(component.id, { ...component, skills: newSkills } as any);
                }}
                className="flex-1 px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                placeholder="Skill name"
              />
              <button
                onClick={() => {
                  const newSkills = skills.filter((_: string, i: number) => i !== index);
                  updateComponent(component.id, { ...component, skills: newSkills } as any);
                }}
                className="p-2 text-[oklch(0.5500_0.26_15)] hover:bg-[oklch(0.9600_0.008_30)] rounded transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            const newSkills = [...skills, ""];
            updateComponent(component.id, { ...component, skills: newSkills } as any);
          }}
          className="w-full px-3 py-2 text-xs font-medium text-[oklch(0.6500_0.22_25)] border border-[oklch(0.6500_0.22_25)] rounded hover:bg-[oklch(0.6500_0.22_25)]/5 transition-colors"
        >
          + Add Skill
        </button>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Alignment</label>
          <div className="flex items-center gap-1 bg-[oklch(0.9600_0.008_30)] rounded-lg p-1">
            {([
              { value: "left", icon: AlignLeft, label: "Left" },
              { value: "center", icon: AlignCenter, label: "Center" },
              { value: "right", icon: AlignRight, label: "Right" },
            ] as const).map(({ value, icon: Icon, label }) => (
              <Tooltip key={value} content={label}>
                <button
                  onClick={() =>
                    updateComponent(component.id, { ...component, alignment: value } as any)
                  }
                  className={`flex-1 p-2 rounded transition-all ${
                    skillsData.alignment === value
                      ? "bg-white text-[oklch(0.6500_0.22_25)] shadow-sm"
                      : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)]"
                  }`}
                >
                  <Icon className="h-4 w-4 mx-auto" />
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Experience component
  if (component.type === "experience") {
    const expData = component as any;
    const experiences = expData.experiences || [];
    
    return (
      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            Experience
          </h3>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {experiences.map((exp: any, index: number) => (
            <div key={index} className="p-3 border border-[oklch(0.9200_0.005_20)] rounded-lg space-y-2">
              <input
                type="text"
                value={exp.position || ""}
                onChange={(e) => {
                  const newExps = [...experiences];
                  newExps[index] = { ...exp, position: e.target.value };
                  updateComponent(component.id, { ...component, experiences: newExps } as any);
                }}
                className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                placeholder="Position"
              />
              <input
                type="text"
                value={exp.company || ""}
                onChange={(e) => {
                  const newExps = [...experiences];
                  newExps[index] = { ...exp, company: e.target.value };
                  updateComponent(component.id, { ...component, experiences: newExps } as any);
                }}
                className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                placeholder="Company"
              />
              <input
                type="text"
                value={exp.period || ""}
                onChange={(e) => {
                  const newExps = [...experiences];
                  newExps[index] = { ...exp, period: e.target.value };
                  updateComponent(component.id, { ...component, experiences: newExps } as any);
                }}
                className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
                placeholder="Period"
              />
              <textarea
                value={exp.description || ""}
                onChange={(e) => {
                  const newExps = [...experiences];
                  newExps[index] = { ...exp, description: e.target.value };
                  updateComponent(component.id, { ...component, experiences: newExps } as any);
                }}
                className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)] resize-none"
                rows={2}
                placeholder="Description"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            const newExps = [...experiences, { position: "", company: "", period: "", description: "" }];
            updateComponent(component.id, { ...component, experiences: newExps } as any);
          }}
          className="w-full px-3 py-2 text-xs font-medium text-[oklch(0.6500_0.22_25)] border border-[oklch(0.6500_0.22_25)] rounded hover:bg-[oklch(0.6500_0.22_25)]/5 transition-colors"
        >
          + Add Experience
        </button>
      </div>
    );
  }

  // Fallback for other components
  if (["services", "pricing", "projects", "award", "review", "languages", "link-block", "tools"].includes(component.type)) {
    return (
      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Layout className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            {component.type}
          </h3>
        </div>
        <p className="text-sm text-[oklch(0.5200_0.015_25)]">
          This component has complex content structure. Please edit it directly on the canvas or use the "Edit" button on the component itself if available.
        </p>
      </div>
    );
  }

  return null;
}
