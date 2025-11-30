"use client";

import React, { useState } from "react";
import { ComponentData } from "@/lib/editor-state";
import { AlertTriangle, Code, Eye, Play } from "lucide-react";
import { Tooltip } from "./tooltip";

interface HTMLBlockProps {
  data: ComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

export function HTMLBlock({ data, isPreviewMode, onUpdate }: HTMLBlockProps) {
  const [html, setHtml] = useState((data as any).html || "");
  const [css, setCss] = useState((data as any).css || "");
  const [js, setJs] = useState((data as any).js || "");
  const [isPreview, setIsPreview] = useState(true);
  const [allowRawScript, setAllowRawScript] = useState(false);

  const handleUpdate = () => {
    onUpdate({
      ...data,
      html,
      css,
      js,
      allowRawScript,
    } as any);
  };

  if (isPreviewMode) {
    // Render preview
    const sanitizedHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          ${allowRawScript ? `<script>${js}</script>` : ""}
        </body>
      </html>
    `;

    return (
      <div className="relative w-full h-full min-h-[50px]">
        {/* Only show indicator in Editor Preview, not in Live Preview if possible, or keep it subtle */}
        <div className="absolute top-0 right-0 z-10 opacity-0 hover:opacity-100 transition-opacity">
          <Tooltip content="HTML Block">
            <div className="px-2 py-1 bg-black/50 text-white text-[10px] font-medium rounded-bl flex items-center gap-1">
              <Code className="h-3 w-3" />
            </div>
          </Tooltip>
        </div>
        <iframe
          key={`${html}-${css}-${js}-${allowRawScript}`}
          srcDoc={sanitizedHTML}
          className="w-full h-full min-h-[inherit] border-0 block"
          sandbox="allow-same-origin allow-scripts"
          title="HTML Block Preview"
          style={{ backgroundColor: 'transparent' }}
        />
      </div>
    );
  }

  // Editor mode
  return (
    <div className="p-4 border border-[oklch(0.9200_0.005_20)] rounded-lg bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          <span className="text-sm font-medium text-[oklch(0.2200_0.015_20)]">HTML Block</span>
          <Tooltip content="Scripts are sanitized by default. Enable raw scripts only if you trust the code.">
            <AlertTriangle className="h-4 w-4 text-[oklch(0.5500_0.26_15)]" />
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              isPreview
                ? "bg-[oklch(0.6500_0.22_25)] text-white"
                : "bg-[oklch(0.9600_0.008_30)] text-[oklch(0.2200_0.015_20)]"
            }`}
          >
            {isPreview ? <Eye className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {isPreview ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-1.5">
              HTML
            </label>
            <textarea
              value={html}
              onChange={(e) => {
                setHtml(e.target.value);
                handleUpdate();
              }}
              className="w-full px-3 py-2 text-sm font-mono border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)] resize-none"
              rows={6}
              placeholder="<div>Your HTML here</div>"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-1.5">
              CSS
            </label>
            <textarea
              value={css}
              onChange={(e) => {
                setCss(e.target.value);
                handleUpdate();
              }}
              className="w-full px-3 py-2 text-sm font-mono border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)] resize-none"
              rows={4}
              placeholder="/* Your CSS here */"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[oklch(0.2200_0.015_20)] mb-1.5 flex items-center gap-2">
              JavaScript
              <label className="flex items-center gap-1.5 text-xs text-[oklch(0.5200_0.015_25)]">
                <input
                  type="checkbox"
                  checked={allowRawScript}
                  onChange={(e) => {
                    setAllowRawScript(e.target.checked);
                    handleUpdate();
                  }}
                  className="rounded"
                />
                Allow raw scripts
              </label>
            </label>
            <textarea
              value={js}
              onChange={(e) => {
                setJs(e.target.value);
                handleUpdate();
              }}
              className="w-full px-3 py-2 text-sm font-mono border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)] resize-none"
              rows={4}
              placeholder="// Your JavaScript here"
            />
          </div>
        </div>
      ) : (
        <div className="border border-[oklch(0.9200_0.005_20)] rounded bg-white min-h-[300px] relative group">
          {(!html && !css && !js) && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-center text-[oklch(0.5200_0.015_25)]">
                 <Code className="h-8 w-8 mx-auto mb-2 opacity-50" />
                 <p className="text-sm">Empty HTML Block</p>
               </div>
             </div>
          )}
          <iframe
            key={`${html}-${css}-${js}-${allowRawScript}`} // Force re-render on content change
            srcDoc={`
              <!DOCTYPE html>
              <html>
                <head>
                  <style>
                    body { margin: 0; padding: 0; }
                    ${css}
                  </style>
                </head>
                <body>
                  ${html}
                  ${allowRawScript ? `<script>${js}</script>` : ""}
                </body>
              </html>
            `}
            className="w-full h-[300px] border-0 block"
            sandbox="allow-same-origin allow-scripts"
            title="Preview"
          />
        </div>
      )}
    </div>
  );
}





