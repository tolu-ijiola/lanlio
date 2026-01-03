"use client";

import React, { useMemo } from "react";
import { HtmlComponentData, ComponentData } from "@/lib/editor-state";
import { Code } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface HtmlProps {
  data: HtmlComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

export default function HtmlComponent({
  data,
  isPreviewMode,
  onUpdate,
}: HtmlProps) {
  const { code } = data;

  const htmlContent = useMemo(() => {
    if (!code) return '';
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { box-sizing: border-box; }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }
          </style>
        </head>
        <body>
          ${code}
          <script>
            (function() {
              try {
                const resizeObserver = new ResizeObserver(entries => {
                  const height = document.body.scrollHeight;
                  if (window.parent) {
                    window.parent.postMessage({ 
                      type: 'resize-html-block', 
                      id: '${data.id}', 
                      height 
                    }, '*');
                  }
                });
                resizeObserver.observe(document.body);
              } catch(e) {
                console.warn('ResizeObserver not supported');
              }
            })();
          </script>
        </body>
      </html>
    `;
  }, [code, data.id]);

  // Canvas mode - show clean content only
  if (!code) {
    return null;
  }

  return (
    <div className="w-full relative min-h-[50px]">
      <iframe
        key={`html-${data.id}-${code?.slice(0, 50)}`}
        srcDoc={htmlContent}
        className="w-full border-0 block"
        style={{ height: '100%', minHeight: '50px' }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
        title="HTML Block"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />
    </div>
  );
}
