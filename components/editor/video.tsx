import React from "react";
import { Input } from "../ui/input";
import { VideoComponentData, ComponentData } from "@/lib/editor-state";

interface VideoProps {
  data: VideoComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function Video({ data, isPreviewMode, onUpdate }: VideoProps) {
  // Convert YouTube/Vimeo URLs to embed format
  const convertToEmbedUrl = (url: string): string => {
    if (!url || typeof url !== 'string') return '';
    
    const trimmedUrl = url.trim();
    
    // If already an embed URL, return as is (but clean it up)
    if (trimmedUrl.includes('youtube.com/embed/')) {
      const embedMatch = trimmedUrl.match(/youtube\.com\/embed\/([^"&?\/\s]{11})/);
      if (embedMatch) {
        return `https://www.youtube.com/embed/${embedMatch[1]}`;
      }
      return trimmedUrl;
    }
    
    if (trimmedUrl.includes('vimeo.com/video/')) {
      return trimmedUrl;
    }
    
    // YouTube - handle various formats
    // Format 1: youtube.com/watch?v=VIDEO_ID
    // Format 2: youtube.com/v/VIDEO_ID
    // Format 3: youtu.be/VIDEO_ID
    // Format 4: m.youtube.com/watch?v=VIDEO_ID
    // Format 5: youtube.com/embed/VIDEO_ID (already handled above)
    
    // Try to extract video ID from various YouTube URL patterns
    let videoId: string | null = null;
    
    // Pattern 1: youtube.com/watch?v=VIDEO_ID or youtube.com/watch?vi=VIDEO_ID
    const watchMatch = trimmedUrl.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?vi=)([a-zA-Z0-9_-]{11})/);
    if (watchMatch) {
      videoId = watchMatch[1];
    }
    
    // Pattern 2: youtu.be/VIDEO_ID
    if (!videoId) {
      const shortMatch = trimmedUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (shortMatch) {
        videoId = shortMatch[1];
      }
    }
    
    // Pattern 3: youtube.com/v/VIDEO_ID
    if (!videoId) {
      const vMatch = trimmedUrl.match(/youtube\.com\/v\/([a-zA-Z0-9_-]{11})/);
      if (vMatch) {
        videoId = vMatch[1];
      }
    }
    
    // Pattern 4: youtube.com/embed/VIDEO_ID (fallback)
    if (!videoId) {
      const embedMatch = trimmedUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch) {
        videoId = embedMatch[1];
      }
    }
    
    // Pattern 5: Generic pattern for any YouTube URL with video ID
    if (!videoId) {
      const genericMatch = trimmedUrl.match(/(?:youtube\.com\/|youtu\.be\/|m\.youtube\.com\/)(?:watch\?v=|v\/|embed\/|)([a-zA-Z0-9_-]{11})/);
      if (genericMatch) {
        videoId = genericMatch[1];
      }
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo
    const vimeoMatch = trimmedUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    // If we can't parse it, return the original URL (might be a direct embed URL)
    return trimmedUrl;
  };

  const embedUrl = data.embedUrl ? convertToEmbedUrl(data.embedUrl) : '';

  // Edit mode - show URL input
  if (!isPreviewMode) {
    return (
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">Video URL</label>
          <Input
            type="text"
            value={data.embedUrl || ''}
            onChange={(e) => onUpdate({ ...data, embedUrl: e.target.value })}
            placeholder="Paste YouTube or Vimeo URL"
            className="w-full h-9 text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Supports YouTube and Vimeo links
          </p>
        </div>
        {data.embedUrl && (
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Title</label>
            <Input
              type="text"
              value={data.title || ''}
              onChange={(e) => onUpdate({ ...data, title: e.target.value })}
              placeholder="Video title"
              className="w-full h-9 text-sm"
            />
          </div>
        )}
      </div>
    );
  }

  // Preview mode - show video or placeholder
  if (!data.embedUrl) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-muted/20">
        <p className="text-sm text-muted-foreground">No video added</p>
      </div>
    );
  }

  // If conversion failed but we have a URL, try to use it directly
  let finalEmbedUrl = embedUrl || data.embedUrl;
  
  if (!finalEmbedUrl) {
    return null;
  }

  // Build iframe src with optional parameters
  const urlParams = new URLSearchParams();
  
  // Add autoplay, mute, loop, controls if specified in data
  if ((data as any).autoplay) urlParams.set('autoplay', '1');
  if ((data as any).mute) urlParams.set('mute', '1');
  if ((data as any).loop) urlParams.set('loop', '1');
  if ((data as any).showControls === false) urlParams.set('controls', '0');
  
  if (urlParams.toString()) {
    finalEmbedUrl = `${finalEmbedUrl}${finalEmbedUrl.includes('?') ? '&' : '?'}${urlParams.toString()}`;
  }

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted shadow">
      <iframe
        src={finalEmbedUrl}
        className="absolute inset-0 w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        frameBorder="0"
        title={data.title || 'Video'}
        loading={(data as any).lazyLoad ? 'lazy' : 'eager'}
      />
    </div>
  );
}

export default Video;



