"use client";

import React, { useState } from "react";
import { FileText, Layout, Palette, Code, ChevronDown, ChevronUp } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface TabbedPanelProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function TabbedPanel({ tabs, defaultTab }: TabbedPanelProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [expandedTabs, setExpandedTabs] = useState<Set<string>>(new Set([activeTab]));

  const toggleTab = (tabId: string) => {
    setExpandedTabs((prev) => {
      const next = new Set(prev);
      if (next.has(tabId)) {
        next.delete(tabId);
      } else {
        next.add(tabId);
      }
      return next;
    });
    setActiveTab(tabId);
  };

  return (
    <div className="space-y-2">
      {tabs.map((tab) => {
        const isExpanded = expandedTabs.has(tab.id);
        const isActive = activeTab === tab.id;
        
        return (
          <div key={tab.id} className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] overflow-hidden">
            <button
              onClick={() => toggleTab(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${
                isActive ? "bg-[oklch(0.6500_0.22_25)]/5" : "hover:bg-[oklch(0.9600_0.008_30)]"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`${isActive ? "text-[oklch(0.6500_0.22_25)]" : "text-[oklch(0.5200_0.015_25)]"}`}>
                  {tab.icon}
                </div>
                <span className={`text-sm font-medium ${isActive ? "text-[oklch(0.2200_0.015_20)]" : "text-[oklch(0.5200_0.015_25)]"}`}>
                  {tab.label}
                </span>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
              )}
            </button>
            {isExpanded && (
              <div className="px-4 py-3 border-t border-[oklch(0.9200_0.005_20)]">
                {tab.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}





