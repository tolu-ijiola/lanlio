"use client";

import React from "react";
import { ComponentData } from "@/lib/editor-state";

export function EffectsPanel({ component }: { component: ComponentData }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
          Shadow
        </h3>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1">Opacity</label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="0"
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
          Opacity
        </h3>
        <div>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="100"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}





