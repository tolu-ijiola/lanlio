"use client";

import React, { useMemo, useState } from "react";
import { NavigationComponentData } from "@/lib/editor-state";
import { Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NavigationProps {
  data: NavigationComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: NavigationComponentData) => void;
}

const linkMap: Record<
  NavigationComponentData["menuItems"][number]["targetType"],
  (value: string) => string
> = {
  anchor: (value) => value || "#",
  link: (value) => value || "#",
  email: (value) => `mailto:${value.replace(/^mailto:/i, "")}`,
  phone: (value) => `tel:${value.replace(/^tel:/i, "")}`,
};

export default function Navigation({
  data,
  isPreviewMode,
  onUpdate,
}: NavigationProps) {
  // Safety check: if data is undefined, return null or use defaults
  if (!data) {
    return null;
  }
  
  // Edit mode - show editing controls
  if (!isPreviewMode) {
    const navData = data;
    const button = navData.button || {
      enabled: false,
      label: 'Hire Me',
      iconMode: 'text',
      style: 'solid',
      linkType: 'anchor',
      linkValue: '#contact',
    };

    const handleButtonUpdate = (updates: Partial<typeof button>) => {
      onUpdate({
        ...navData,
        button: {
          ...button,
          ...updates,
        },
      });
    };

    return (
      <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/20">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">CTA Button</h4>
            <div className="flex items-center gap-2">
              <Label htmlFor="button-enabled" className="text-xs">Enabled</Label>
              <Switch
                id="button-enabled"
                checked={button.enabled}
                onCheckedChange={(checked) => handleButtonUpdate({ enabled: checked })}
              />
            </div>
          </div>

          {button.enabled && (
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Button Text</Label>
                  <Input
                    type="text"
                    value={button.label || ''}
                    onChange={(e) => handleButtonUpdate({ label: e.target.value })}
                    placeholder="Hire Me"
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Link</Label>
                  <Input
                    type="text"
                    value={button.linkValue || ''}
                    onChange={(e) => handleButtonUpdate({ linkValue: e.target.value })}
                    placeholder="#contact"
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Icon Mode</Label>
                  <select
                    value={button.iconMode || 'text'}
                    onChange={(e) => handleButtonUpdate({ iconMode: e.target.value as 'text' | 'icon' | 'both' })}
                    className="h-9 w-full px-3 text-xs border border-border rounded-md bg-background"
                  >
                    <option value="text">Text Only</option>
                    <option value="icon">Icon Only</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Style</Label>
                  <select
                    value={button.style || 'solid'}
                    onChange={(e) => handleButtonUpdate({ style: e.target.value as 'solid' | 'outline' | 'ghost' })}
                    className="h-9 w-full px-3 text-xs border border-border rounded-md bg-background"
                  >
                    <option value="solid">Solid</option>
                    <option value="outline">Outline</option>
                    <option value="ghost">Ghost</option>
                  </select>
                </div>
              </div>

              {button.iconMode !== 'text' && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Icon</Label>
                  <Input
                    type="text"
                    value={button.icon || '↗'}
                    onChange={(e) => handleButtonUpdate({ icon: e.target.value })}
                    placeholder="↗"
                    className="h-9 text-sm"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  const navData = data;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredMenuId, setHoveredMenuId] = useState<string | null>(null);
  const menuItems = useMemo(
    () => (data?.menuItems || []).slice(0, 4),
    [data?.menuItems]
  );

  const menuDisplay = navData.menuDisplay || "inline";
  const variant = navData.variant || "logo-text";
  const brandText = navData.brandText || "Studio";
  const navStyles = ((navData as any).styles || {}) as React.CSSProperties;
  const menuTextColor = (navStyles.color as string) || "oklch(0.4300 0.02 25)";
  const menuHoverColor =
    (navStyles as Record<string, string>)?.["--menu-hover-color"] ||
    "oklch(0.2200 0.015 20)";

  const alignment = (navData as any).alignment || "space-between";
  // Map alignment values to flex classes
  const getAlignmentClass = () => {
    if (alignment === "center") return "justify-center";
    if (alignment === "left") return "justify-start";
    if (alignment === "right") return "justify-end";
    return "justify-between"; // space-between
  };
  const menuSpacing = (navData as any).menuSpacing || "24px";
  const position = (navData as any).position || "default";
  
  // Apply sticky only if position is "fixed"
  const stickyClass = position === "fixed" ? "sticky top-0 z-30 backdrop-blur-xl" : "";
  const isSticky = position === "fixed";

  const primaryAccent = "var(--palette-primary, #0f172a)";
  // Get computed primary color or use fallback
  const getPrimaryColor = () => {
    if (typeof window !== 'undefined') {
      const computed = getComputedStyle(document.documentElement).getPropertyValue('--palette-primary').trim();
      return computed || '#0f172a';
    }
    return '#0f172a';
  };

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

    const logoBgColor = getPrimaryColor();
    
    return (
      <div
        className="h-10 w-10 rounded-lg font-semibold flex items-center justify-center"
        style={{ 
          backgroundColor: logoBgColor,
          color: '#ffffff'
        }}
      >
        <p className="text-white text-sm font-semibold">{brandText.slice(0, 2).toUpperCase()}</p>
      </div>
    );
  };

  const renderLogo = () => {
    if (variant === "logo-only") {
      return renderLogoBadge();
    }

    const brandTextColor = (navStyles as Record<string, string>)?.["--brand-text-color"] || "oklch(0.2200_0.015_20)";
    const brandTextSize = (navData as any).brandTextSize || "text-base";
    const brandTextClass = brandTextSize === "h1" ? "text-4xl font-bold" :
                          brandTextSize === "h2" ? "text-3xl font-bold" :
                          brandTextSize === "h3" ? "text-2xl font-semibold" :
                          brandTextSize === "h4" ? "text-xl font-semibold" :
                          brandTextSize === "h5" ? "text-lg font-semibold" :
                          brandTextSize === "h6" ? "text-base font-semibold" :
                          "text-base font-semibold";

    return (
      <div className="flex items-center gap-2">
        {variant === "logo-text" && renderLogoBadge()}
        <div>
          <div className={brandTextClass} style={{ color: brandTextColor }}>
            {brandText}
          </div>
          {(navData as any).tagline && (
            <div className="text-xs text-[oklch(0.5200_0.015_25)]">
              {(navData as any).tagline}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMenuLinks = (className: string) => {
    const gapStyle = alignment === "center" ? { gap: menuSpacing } : { gap: "24px" };
    return (
      <ul className={`flex items-center ${className}`} style={gapStyle}>
        {menuItems.map((item) => (
          <li key={item.id}>
            <a
              href={linkMap[item.targetType](item.targetValue)}
              className="text-sm font-medium transition-colors"
              style={{
                color: hoveredMenuId === item.id ? menuHoverColor : menuTextColor,
                // Force color to override any CSS classes
                '--menu-text-color': menuTextColor,
                '--menu-hover-color': menuHoverColor,
              } as React.CSSProperties}
              onMouseEnter={() => setHoveredMenuId(item.id)}
              onMouseLeave={() => setHoveredMenuId(null)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  const renderButton = ({
    fullWidth = false,
    center = false,
    marginTop = false,
  }: { fullWidth?: boolean; center?: boolean; marginTop?: boolean } = {}) => {
    if (!navData.button?.enabled) return null;
    const button = navData.button;
    // Get button colors - check multiple sources in order of priority
    // 1. Direct properties on navData (buttonColor, buttonTextColor)
    // 2. CSS custom properties in styles (--button-color, --button-text-color)
    // 3. Regular properties in styles (buttonColor, buttonTextColor)
    // 4. Fallback to defaults
    const allStyles = (navData as any).styles || navStyles || {};
    const dataStyles = (navData as any).styles || {};
    
    // Try multiple ways to get the button color - check direct properties first
    const buttonBgColor = (navData as any).buttonColor ||
                         (dataStyles as any)?.["--button-color"] || 
                         (allStyles as any)?.["--button-color"] || 
                         (dataStyles as any)?.buttonColor || 
                         (allStyles as any)?.buttonColor ||
                         (navStyles as any)?.["--button-color"] ||
                         primaryAccent;
    const buttonTextColor = (navData as any).buttonTextColor ||
                          (dataStyles as any)?.["--button-text-color"] || 
                          (allStyles as any)?.["--button-text-color"] ||
                          (dataStyles as any)?.buttonTextColor ||
                          (allStyles as any)?.buttonTextColor ||
                          (navStyles as any)?.["--button-text-color"] ||
                          (button.style === "ghost" ? buttonBgColor : "white");
    const buttonBorderRadius = (allStyles as any)?.["--button-border-radius"] || 
                              (allStyles as any)?.buttonBorderRadius ||
                              (navStyles as any)?.["--button-border-radius"] ||
                              "9999px";
    const baseClass =
      "px-4 py-2 text-sm font-semibold transition-colors inline-flex items-center gap-2";
    const styleClass =
      button.style === "outline"
        ? `border hover:opacity-90`
        : button.style === "ghost"
        ? `hover:opacity-80`
        : `hover:opacity-90`;
    const showText = button.iconMode === "text" || button.iconMode === "both";
    const showIcon = button.iconMode === "icon" || button.iconMode === "both";
    const iconPlacement = (button as any).iconPlacement || "left";

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

    // Ensure button colors are actual color values, not CSS variables
    // Convert to strings to safely check and resolve
    const bgColorStr = String(buttonBgColor || '').trim();
    const textColorStr = String(buttonTextColor || '').trim();
    
    // Resolve background color - handle CSS variables and empty values
    let resolvedBgColor: string;
    if (!bgColorStr || bgColorStr === 'undefined' || bgColorStr === 'null') {
      // No color set, use primary
      resolvedBgColor = getPrimaryColor();
    } else if (bgColorStr.startsWith('var(')) {
      // CSS variable - resolve it
      if (bgColorStr.includes('--palette-primary')) {
        resolvedBgColor = getPrimaryColor();
      } else {
        // Try to get computed value, fallback to primary
        resolvedBgColor = getPrimaryColor();
      }
    } else {
      // Direct color value - use it as-is
      resolvedBgColor = bgColorStr;
    }
    
    // Resolve text color - handle CSS variables and empty values
    let resolvedTextColor: string;
    if (!textColorStr || textColorStr === 'undefined' || textColorStr === 'null') {
      // No color set, use appropriate default
      if (button.style === "ghost") {
        resolvedTextColor = resolvedBgColor;
      } else {
        resolvedTextColor = "#ffffff"; // Default white text on colored background
      }
    } else if (textColorStr.startsWith('var(')) {
      // CSS variable - resolve it
      if (button.style === "ghost") {
        resolvedTextColor = resolvedBgColor;
      } else {
        resolvedTextColor = "#ffffff"; // Default white for solid/outline
      }
    } else {
      // Direct color value - use it as-is
      resolvedTextColor = textColorStr;
    }

    // Build final button style with resolved colors
    // Always apply colors directly - ensure they override any CSS
    const finalButtonStyle: React.CSSProperties & { [key: string]: any } = {
      backgroundColor: button.style !== "ghost" ? resolvedBgColor : "transparent",
      borderColor: button.style === "outline" ? resolvedBgColor : "transparent",
      color: resolvedTextColor,
      borderRadius: buttonBorderRadius,
    };
    
    // Force apply colors to ensure they work - use !important via inline style
    if (button.style !== "ghost" && resolvedBgColor) {
      finalButtonStyle.backgroundColor = resolvedBgColor;
      finalButtonStyle['--button-bg'] = resolvedBgColor;
    }
    if (resolvedTextColor) {
      finalButtonStyle.color = resolvedTextColor;
      finalButtonStyle['--button-text'] = resolvedTextColor;
    }

    // Use a unique ID for this button to apply styles
    const buttonId = `nav-button-${navData.id}`;
    
    // Inject styles immediately to ensure colors are applied
    if (typeof window !== 'undefined' && button.style !== "ghost" && resolvedBgColor && resolvedTextColor) {
      const styleId = `style-${buttonId}`;
      let styleEl = document.getElementById(styleId);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = `
        #${buttonId} {
          background-color: ${resolvedBgColor} !important;
          color: ${resolvedTextColor} !important;
          border-color: ${button.style === "outline" ? resolvedBgColor : "transparent"} !important;
        }
        #${buttonId} span {
          color: ${resolvedTextColor} !important;
        }
      `;
    }

    return (
      <a
        id={buttonId}
        href={linkMap[button.linkType as keyof typeof linkMap](button.linkValue)}
        className={`${baseClass} ${styleClass} ${layoutClass}`.trim()}
        style={finalButtonStyle}
      >
        {showIcon && iconPlacement === "left" && <span style={{ color: resolvedTextColor }}>{iconNode}</span>}
        {showText && <span style={{ color: resolvedTextColor }}>{button.label || "Let's Chat"}</span>}
        {showIcon && iconPlacement === "right" && <span style={{ color: resolvedTextColor }}>{iconNode}</span>}
      </a>
    );
  };

  const navJustifyClass = getAlignmentClass();
  
  // Merge styles to ensure CSS variables are properly set
  const navStyle: React.CSSProperties = {
    ...((navData as any).styles || {}),
    // Ensure CSS custom properties are included
    ...((navData as any).styles && typeof (navData as any).styles === 'object' ? (navData as any).styles : {}),
  } as React.CSSProperties;

  return (
    <nav
      className={`w-full ${stickyClass}`}
      style={navStyle}
      data-editor-component
    >
      {/* Inner container with max-width for content, but nav itself is full width */}
      <div className="w-full max-w-[700px] py-2 mx-auto px-4 sm:px-6">
        <div className={`flex items-center w-full ${navJustifyClass} ${alignment === "center" ? "gap-6" : ""} py-4 gap-3 sm:gap-4`}>
          {/* Logo - left side for space-between, inside menu for center - hidden on mobile to avoid duplicate */}
          {alignment !== "center" && (
            <div className="hidden md:block shrink-0 mr-4">
              {renderLogo()}
            </div>
          )}

          {/* Desktop Menu */}
          {menuDisplay === "inline" && alignment === "center" && (
            <div className="hidden md:flex items-center gap-4">
              {renderLogo()}
              {renderMenuLinks("")}
              {renderButton()}
            </div>
          )}

          {menuDisplay === "inline" && alignment !== "center" && (
            <div className="hidden md:flex items-center gap-8 shrink-0 ml-auto">
              {renderMenuLinks("")}
              {renderButton()}
            </div>
          )}

        {menuDisplay === "hamburger" && alignment === "center" && (
          <div className="hidden md:flex items-center gap-4">
            {renderLogo()}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="p-2 rounded-full border border-[oklch(0.9200_0.005_20)] text-[oklch(0.5200_0.015_25)]"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            {renderButton()}
          </div>
        )}

        {menuDisplay === "hamburger" && alignment !== "center" && (
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
          <div className="flex md:hidden items-center justify-between gap-3 w-full">
            {alignment === "center" ? (
              <>
                <div className="flex-1 flex justify-center">
                  {renderLogo()}
                </div>
                <div className="flex items-center gap-3">
                  {renderButton()}
                  <button
                    onClick={() => setMobileOpen((prev) => !prev)}
                    className="p-2 rounded-full border border-[oklch(0.9200_0.005_20)] text-[oklch(0.5200_0.015_25)] shrink-0"
                  >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="shrink-0">
                  {renderLogo()}
                </div>
                <div className="flex items-center gap-3">
                  {renderButton()}
                  <button
                    onClick={() => setMobileOpen((prev) => !prev)}
                    className="p-2 rounded-full border border-[oklch(0.9200_0.005_20)] text-[oklch(0.5200_0.015_25)] shrink-0"
                  >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="w-full max-w-[700px] mx-auto px-6">
          <div className="border border-[oklch(0.9200_0.005_20)] rounded-2xl p-4 space-y-4 md:hidden">
            {renderMenuLinks("flex flex-col gap-3")}
            {renderButton({ fullWidth: true, center: true, marginTop: true })}
          </div>
        </div>
      )}

      {mobileOpen && menuDisplay === "hamburger" && (
        <div className="w-full max-w-[700px] mx-auto px-6">
          <div className="hidden md:block border border-[oklch(0.9200_0.005_20)] rounded-2xl p-4 mt-2 space-y-4">
            {renderMenuLinks("flex flex-col gap-3")}
            {renderButton({ fullWidth: true, center: true, marginTop: true })}
          </div>
        </div>
      )}
    </nav>
  );
}

