import React from "react";
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  Mail,
  Dribbble,
} from "lucide-react";
import { SocialMediaComponentData } from "@/lib/editor-state";

const PLATFORM_ICON_MAP: Record<string, React.ComponentType<any>> = {
  GitHub: Github,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  YouTube: Youtube,
  Youtube,
  Website: Globe,
  Email: Mail,
  Dribbble,
};

const SIZE_TOKENS = {
  sm: { padding: "6px 12px", icon: 16, gap: "6px", font: "0.82rem" },
  md: { padding: "10px 18px", icon: 18, gap: "8px", font: "0.9rem" },
  lg: { padding: "14px 22px", icon: 20, gap: "10px", font: "1rem" },
};

const SHAPE_RADIUS: Record<NonNullable<SocialMediaComponentData["shape"]>, string> = {
  pill: "999px",
  rounded: "16px",
  square: "8px",
};

interface SocialMediaProps {
  data: SocialMediaComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: SocialMediaComponentData) => void;
}

function SocialMedia({ data }: SocialMediaProps) {
  if (!data.links || data.links.length === 0) {
    return (
      <div className="w-full border border-dashed border-[oklch(0.9200_0.005_20)] rounded-2xl py-10 text-center text-sm text-[oklch(0.5200_0.015_25)]">
        Add social accounts from the inspector to showcase them here.
      </div>
    );
  }

  const alignment = data.alignment || "center";
  const arrangement = data.arrangement || "horizontal";
  const displayMode = data.displayMode || "icons-text";
  const size = SIZE_TOKENS[data.size || "md"];
  const buttonStyle = data.buttonStyle || "filled";
  const shape = SHAPE_RADIUS[data.shape || "pill"];
  const background = data.backgroundColor || "rgba(255,255,255,0.9)";
  const iconColor = data.iconColor || "var(--palette-primary)";
  const textColor = data.textColor || "var(--palette-title)";
  const outlineColor = buttonStyle === "outline" ? "rgba(15,23,42,0.12)" : "transparent";

  const iconOrientation = data.iconOrientation || "inline";
  const lineMode = data.lineMode || "auto";

  const alignmentClass =
    alignment === "left" ? "justify-start" : alignment === "right" ? "justify-end" : "justify-center";

  const containerClass =
    lineMode === "single"
      ? "flex flex-col gap-3 w-full"
      : [
          "flex gap-3 flex-wrap",
          arrangement === "vertical" ? "flex-col" : "flex-row",
          alignmentClass,
        ].join(" ");

  const itemBaseClass =
    iconOrientation === "stacked"
      ? "inline-flex flex-col items-center text-center"
      : "inline-flex items-center";

  return (
    <div className={containerClass}>
      {data.links.map((link) => {
        const Icon = PLATFORM_ICON_MAP[link.platform] || Globe;
        const showIcon = displayMode !== "text-only";
        const showText = displayMode !== "icons-only";
        return (
          <a
            key={`${link.platform}-${link.url}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${itemBaseClass} transition-colors`}
            style={{
              padding: size.padding,
              gap: size.gap,
              borderRadius: shape,
              backgroundColor: buttonStyle === "filled" ? background : "transparent",
              border: `1px solid ${outlineColor}`,
              color: textColor,
              width: lineMode === "single" ? "100%" : arrangement === "vertical" ? "60%" : undefined,
              justifyContent:
                lineMode === "single" || arrangement === "vertical" ? "center" : "flex-start",
              alignSelf:
                lineMode === "single"
                  ? "stretch"
                  : alignment === "left"
                  ? "flex-start"
                  : alignment === "right"
                  ? "flex-end"
                  : "center",
            }}
            >
              {showIcon && (
                link.customIcon ? (
                  <img
                    src={link.customIcon}
                    alt={`${link.platform} icon`}
                    style={{
                      width: size.icon,
                      height: size.icon,
                      objectFit: "contain",
                      filter: buttonStyle === "filled" ? "none" : undefined,
                    }}
                  />
                ) : (
                  <Icon
                    style={{
                      width: size.icon,
                      height: size.icon,
                      color: iconColor,
                    }}
                  />
                )
              )}
            {showText && (
              <span
                style={{
                  fontSize: size.font,
                  color: textColor,
                  fontWeight: 500,
                }}
              >
                {link.platform}
              </span>
            )}
          </a>
        );
      })}
    </div>
  );
}

export default SocialMedia;
