import React from "react";
import { User } from "lucide-react";
import { ProfilePhotoComponentData } from "@/lib/editor-state";

interface ProfilePhotoProps {
  data: ProfilePhotoComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ProfilePhotoComponentData) => void;
}

const SIZE_MAP: Record<NonNullable<ProfilePhotoComponentData["size"]>, number> = {
  sm: 120,
  md: 160,
  lg: 200,
};

export default function ProfilePhoto({ data }: ProfilePhotoProps) {
  const alignment = data.alignment || "center";
  const alignClass =
    alignment === "left" ? "justify-start" : alignment === "right" ? "justify-end" : "justify-center";
  const rounded = data.rounded || "full";
  const size = SIZE_MAP[data.size || "md"];
  const showBadge = data.showBadge ?? true;
  const badgeColor = data.badgeColor || "oklch(0.72 0.2 150)";

  const borderRadius =
    rounded === "full" ? "9999px" : rounded === "small" ? "1.25rem" : "0.75rem";

  const imageContent = data.image ? (
    <img
      src={data.image}
      alt="Profile"
      className="w-full h-full object-cover"
      style={{ borderRadius }}
    />
  ) : (
    <div
      className="w-full h-full flex flex-col items-center justify-center text-[oklch(0.5200_0.015_25)] bg-[oklch(0.9600_0.008_30)]"
      style={{ borderRadius }}
    >
      <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center mb-2">
        <User className="h-6 w-6" />
      </div>
      <p className="text-xs font-medium">Profile Photo</p>
    </div>
  );

  return (
    <div className={`flex ${alignClass}`} data-editor-component>
      <div
        className="relative shadow-[0_10px_35px_rgba(15,23,42,0.08)] bg-white/80 border border-[oklch(0.9200_0.005_20)] backdrop-blur"
        style={{
          borderRadius,
          width: size,
          height: size,
        }}
      >
        <div className="absolute inset-0" style={{ borderRadius }}>
          {imageContent}
        </div>
        {showBadge && (
          <span
            className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md"
            style={{
              backgroundColor: badgeColor,
              bottom: rounded === "full" ? 10 : 8,
              right: rounded === "full" ? 10 : 8,
            }}
          />
        )}
      </div>
    </div>
  );
}



