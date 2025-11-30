"use client";

import React, { useMemo, useState } from "react";
import { NavigationComponentData } from "@/lib/editor-state";
import { Menu, X } from "lucide-react";

interface NavigationProps {
  data: NavigationComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: NavigationComponentData) => void;
}

const linkMap: Record<
  NavigationComponentData["menuItems"][number]["targetType"],
  (value: string) => string
> = {
  page: (value) => value || "#",
  link: (value) => value || "#",
  email: (value) => `mailto:${value.replace(/^mailto:/i, "")}`,
  phone: (value) => `tel:${value.replace(/^tel:/i, "")}`,
};

export default function Navigation({
  data,
  isPreviewMode,
  onUpdate,
}: NavigationProps) {
  const navData = data;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredMenuId, setHoveredMenuId] = useState<string | null>(null);
  const menuItems = useMemo(
    () => (data.menuItems || []).slice(0, 4),
    [data.menuItems]
  );

  const menuDisplay = navData.menuDisplay || "inline";
  const variant = navData.variant || "logo-text";
  const brandText = navData.brandText || "Studio";
  const navStyles = (navData.styles || {}) as React.CSSProperties;
  const menuTextColor = (navStyles.color as string) || "oklch(0.4300 0.02 25)";
  const menuHoverColor =
    (navStyles as Record<string, string>)?.["--menu-hover-color"] ||
    "oklch(0.2200 0.015 20)";

  const stickyClass = navData.isSticky ? "sticky top-0 z-30 backdrop-blur-xl" : "";

  const primaryAccent = "var(--palette-primary, #0f172a)";

  const renderLogoBadge = () => {
    if (navData.logoImage) {
      return (
        <img
          src={navData.logoImage}
          alt={brandText}
          className="h-10 w-10 rounded-lg object-cover"
        />
      );
    }

    return (
      <div
        className="h-10 w-10 rounded-lg text-white font-semibold flex items-center justify-center"
        style={{ backgroundColor: primaryAccent }}
      >
        {brandText.slice(0, 2).toUpperCase()}
      </div>
    );
  };

  const renderLogo = () => {
    if (variant === "logo-only") {
      return renderLogoBadge();
    }

    return (
      <div className="flex items-center gap-2">
        {variant === "logo-text" && renderLogoBadge()}
        <div>
          <div className="text-base font-semibold text-[oklch(0.2200_0.015_20)]">
            {brandText}
          </div>
          {navData.tagline && (
            <div className="text-xs text-[oklch(0.5200_0.015_25)]">
              {navData.tagline}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMenuLinks = (className: string) => (
    <ul className={`flex items-center gap-6 ${className}`}>
      {menuItems.map((item) => (
        <li key={item.id}>
          <a
            href={linkMap[item.targetType](item.targetValue)}
            className="text-sm font-medium transition-colors"
            style={{
              color: hoveredMenuId === item.id ? menuHoverColor : menuTextColor,
            }}
            onMouseEnter={() => setHoveredMenuId(item.id)}
            onMouseLeave={() => setHoveredMenuId(null)}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );

  const renderButton = ({
    fullWidth = false,
    center = false,
    marginTop = false,
  }: { fullWidth?: boolean; center?: boolean; marginTop?: boolean } = {}) => {
    if (!navData.button?.enabled) return null;
    const button = navData.button;
    const baseClass =
      "px-4 py-2 text-sm font-semibold rounded-full transition-colors inline-flex items-center gap-2";
    const styleClass =
      button.style === "outline"
        ? "border border-[oklch(0.6500_0.22_25)] text-[oklch(0.6500_0.22_25)] hover:bg-[oklch(0.6500_0.22_25)]/10"
        : button.style === "ghost"
        ? "text-[oklch(0.6500_0.22_25)] hover:bg-[oklch(0.6500_0.22_25)]/10"
        : "bg-[oklch(0.6500_0.22_25)] text-white hover:bg-[oklch(0.6000_0.22_25)]";
    const showText = button.iconMode === "text" || button.iconMode === "both";
    const showIcon = button.iconMode === "icon" || button.iconMode === "both";
    const iconPlacement = button.iconPlacement || "left";

    const iconNode = showIcon ? (
      <span className="text-lg leading-none">{button.icon || "↗"}</span>
    ) : null;

    const layoutClass = [
      fullWidth ? "w-full justify-center" : "justify-center",
      center ? "mx-auto" : "",
      marginTop ? "mt-3" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <a
        href={linkMap[button.linkType](button.linkValue)}
        className={`${baseClass} ${styleClass} ${layoutClass}`.trim()}
      >
        {showIcon && iconPlacement === "left" && iconNode}
        {showText && <span>{button.label || "Let’s Chat"}</span>}
        {showIcon && iconPlacement === "right" && iconNode}
      </a>
    );
  };

  return (
    <nav
      className={`w-full ${stickyClass}`}
      style={navData.styles as React.CSSProperties}
      data-editor-component
    >
      <div className="flex items-center justify-between gap-6 py-4">
        {renderLogo()}

        {/* Desktop Menu */}
        {menuDisplay === "inline" && (
          <div className="hidden md:flex items-center gap-8">
            {renderMenuLinks("")}
            {renderButton()}
          </div>
        )}

        {menuDisplay === "hamburger" && (
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="p-2 rounded-full border border-[oklch(0.9200_0.005_20)] text-[oklch(0.5200_0.015_25)]"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            {renderButton()}
          </div>
        )}

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3 w-full">
          <div className="flex-1 flex justify-center">
            {renderButton({ fullWidth: true, center: true })}
          </div>
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="p-2 rounded-full border border-[oklch(0.9200_0.005_20)] text-[oklch(0.5200_0.015_25)]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border border-[oklch(0.9200_0.005_20)] rounded-2xl p-4 space-y-4 md:hidden">
          {renderMenuLinks("flex flex-col gap-3")}
          {renderButton({ fullWidth: true, center: true, marginTop: true })}
        </div>
      )}

      {mobileOpen && menuDisplay === "hamburger" && (
        <div className="hidden md:block border border-[oklch(0.9200_0.005_20)] rounded-2xl p-4 mt-2 space-y-4">
          {renderMenuLinks("flex flex-col gap-3")}
          {renderButton({ fullWidth: true, center: true, marginTop: true })}
        </div>
      )}
    </nav>
  );
}

