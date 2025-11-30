import React from "react";
import { Input } from "../ui/input";
import { Github, ExternalLink, Calendar, GitBranch, Star, Code } from "lucide-react";
import { GitHubComponentData, ComponentData } from "@/lib/editor-state";

interface GitHubProps {
  data: GitHubComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function GitHub({ data, isPreviewMode, onUpdate }: GitHubProps) {
  if (isPreviewMode) {
    if (!data.username) return null;

    const styles = (data as any).styles || {};
    const backgroundColor = styles.backgroundColor || '#ffffff';
    const borderColor = styles.borderColor || '#e5e7eb';
    const borderRadius = styles.borderRadius || '12px';
    const borderWidth = styles.borderWidth || '1px';
    const padding = styles.padding || '24px';
    const boxShadow = styles.boxShadow;
    const titleColor = styles.color || 'var(--palette-title)';
    const descriptionColor = styles.descriptionColor || 'var(--palette-description)';

    return (
      <div 
        className="space-y-4 transition-all duration-300 hover:shadow-lg"
        style={{
          backgroundColor: backgroundColor,
          borderRadius: borderRadius,
          borderColor: borderColor,
          borderWidth: borderWidth,
          borderStyle: 'solid',
          padding: padding,
          boxShadow: boxShadow,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Github className="size-6" style={{ color: 'var(--palette-primary)' }} />
            <a
              href={`https://github.com/${data.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
              style={{ color: titleColor }}
            >
              @{data.username}
            </a>
          </div>
          <a
            href={`https://github.com/${data.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            <ExternalLink className="size-4" style={{ color: descriptionColor }} />
          </a>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm" style={{ color: descriptionColor }}>
            <Calendar className="size-4" />
            <span>Contributions in the past year</span>
          </div>
          
          <div 
            className="border border-border rounded-lg p-4 overflow-x-auto bg-muted/30"
            style={{ 
              borderRadius: borderRadius,
              borderColor: borderColor,
            }}
          >
            <img
              src={`https://github-contributions-api.deno.dev/${data.username}.svg?theme=github&animation=false&format=svg`}
              alt={`GitHub contribution graph for ${data.username}`}
              className="w-full h-auto"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                // Fallback to alternative API
                target.src = `https://ghchart.rshah.org/${data.username}`;
                target.onerror = () => {
                  // Final fallback
                  target.src = `https://github-readme-activity-graph.vercel.app/graph?username=${data.username}&theme=github&hide_border=true`;
                  target.onerror = () => {
                    target.style.display = 'none';
                    const container = target.parentElement;
                    if (container) {
                      container.innerHTML = `
                        <div class="text-sm text-center py-8" style="color: var(--palette-description)">
                          <p class="mb-2">Unable to load contribution graph.</p>
                          <p class="text-xs">Visit <a href="https://github.com/${data.username}" target="_blank" class="underline" style="color: var(--palette-primary)">GitHub profile</a> to view activity.</p>
                        </div>
                      `;
                    }
                  };
                };
              }}
            />
          </div>

          {data.showRepos && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50" style={{ borderRadius: borderRadius }}>
                <GitBranch className="size-4" style={{ color: 'var(--palette-primary)' }} />
                <div>
                  <div className="text-xs" style={{ color: descriptionColor }}>Repositories</div>
                  <div className="text-sm font-semibold" style={{ color: titleColor }}>
                    <img
                      src={`https://github-readme-stats.vercel.app/api?username=${data.username}&show_icons=false&hide_title=true&hide=prs,issues&count_private=true&hide_border=true&bg_color=00000000&text_color=666`}
                      alt="GitHub stats"
                      className="h-5 inline"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50" style={{ borderRadius: borderRadius }}>
                <Star className="size-4" style={{ color: 'var(--palette-primary)' }} />
                <div>
                  <div className="text-xs" style={{ color: descriptionColor }}>Total Stars</div>
                  <div className="text-sm font-semibold" style={{ color: titleColor }}>
                    <img
                      src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${data.username}&layout=compact&hide_border=true&bg_color=00000000&text_color=666`}
                      alt="GitHub languages"
                      className="h-5 inline"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Input
        placeholder="GitHub Username"
        value={data.username || ''}
        onChange={(e) => onUpdate({ ...data, username: e.target.value })}
        className="h-12"
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="show-repos"
          checked={data.showRepos || false}
          onChange={(e) => onUpdate({ ...data, showRepos: e.target.checked })}
          className="rounded"
        />
        <label htmlFor="show-repos" className="text-sm">
          Show repository stats
        </label>
      </div>
      {data.username && (
        <div className="border border-border rounded-lg p-4"
          style={{ 
            borderRadius: 'var(--palette-radius, 0.75rem)',
            borderColor: 'rgba(var(--primary-rgb, 0,0,0), 0.1)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Github className="size-6" style={{ color: 'var(--palette-primary)' }} />
            <a
              href={`https://github.com/${data.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
              style={{ color: 'var(--palette-title)' }}
            >
              @{data.username}
            </a>
            <ExternalLink className="size-4 ml-auto" style={{ color: 'var(--palette-description)' }} />
          </div>
          <div className="text-xs" style={{ color: 'var(--palette-description)' }}>
            Contribution graph will appear in preview
          </div>
        </div>
      )}
    </div>
  );
}

export default GitHub;
