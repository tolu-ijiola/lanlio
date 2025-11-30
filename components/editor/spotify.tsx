import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Music, Plus, X, ExternalLink, Play, Disc, Mic } from "lucide-react";
import { SpotifyComponentData, ComponentData } from "@/lib/editor-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface SpotifyProps {
  data: SpotifyComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function Spotify({ data, isPreviewMode, onUpdate }: SpotifyProps) {
  const compact = (data as any).compact || false;
  const theme = (data as any).theme || 'dark';

  // Extract ID and type from URL
  const getSpotifyInfo = (url: string) => {
    if (!url) return { id: '', type: 'playlist' };
    
    // Handle various Spotify URL formats
    // playlist/ID, track/ID, album/ID, artist/ID
    const typeMatch = url.match(/(playlist|track|album|artist|show|episode)\/([a-zA-Z0-9]+)/);
    if (typeMatch) {
      return { type: typeMatch[1], id: typeMatch[2] };
    }
    
    // Fallback for just ID (assume playlist)
    const idMatch = url.match(/^([a-zA-Z0-9]+)$/);
    if (idMatch) {
      return { type: 'playlist', id: idMatch[1] };
    }
    
    return { id: '', type: 'playlist' };
  };

  const playlists = (data as any).playlists || (data.playlistUrl ? [{ url: data.playlistUrl, title: data.title || 'My Playlist' }] : []);

  const handleAddPlaylist = () => {
    const newPlaylists = [...playlists, { url: '', title: '' }];
    onUpdate({ ...data, playlists: newPlaylists } as any);
  };

  const handleRemovePlaylist = (index: number) => {
    const newPlaylists = playlists.filter((_: any, i: number) => i !== index);
    onUpdate({ ...data, playlists: newPlaylists } as any);
  };

  const handleUpdatePlaylist = (index: number, field: string, value: string) => {
    const newPlaylists = [...playlists];
    newPlaylists[index] = { ...newPlaylists[index], [field]: value };
    onUpdate({ ...data, playlists: newPlaylists } as any);
  };

  if (isPreviewMode) {
    if (playlists.length === 0) return null;

    const styles = (data as any).styles || {};
    const gap = (data as any).gap || '24px';
    const titleColor = styles.color || 'var(--palette-title)';
    const descriptionColor = styles.descriptionColor || 'var(--palette-description)';
    const backgroundColor = styles.backgroundColor || '#ffffff';
    const borderColor = styles.borderColor || '#e5e7eb';
    const borderRadius = styles.borderRadius || '12px';
    const borderWidth = styles.borderWidth || '1px';
    const padding = styles.padding || '16px';
    const boxShadow = styles.boxShadow;
    const layout = (data as any).layout || 'grid';

    // Grid layout - show multiple items
    if (layout === 'grid' && playlists.length > 1) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap }}>
          {playlists.map((item: any, index: number) => {
            const { id, type } = getSpotifyInfo(item.url);
            if (!id) return null;

            // Height depends on compact mode and type
            let height = "352";
            if (compact) height = "152";
            if (type === 'track') height = "152"; // Tracks are always smaller

            return (
              <div
                key={index}
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{
                  backgroundColor: backgroundColor,
                  borderRadius: borderRadius,
                  borderColor: borderColor,
                  borderWidth: borderWidth,
                  borderStyle: 'solid',
                  boxShadow: boxShadow,
                }}
              >
                <div className="relative overflow-hidden" style={{ borderRadius: borderRadius }}>
                  <iframe
                    src={`https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=${theme}`}
                    width="100%"
                    height={height}
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    style={{ borderRadius: borderRadius }}
                  />
                </div>
                {item.title && (
                  <div className="p-3 border-t border-border/50" style={{ padding }}>
                    <h3 
                      className="font-semibold text-sm truncate"
                      style={{ color: titleColor }}
                    >
                      {item.title}
                    </h3>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    // Single item or list layout
    return (
      <div className="space-y-6">
        {playlists.map((item: any, index: number) => {
          const { id, type } = getSpotifyInfo(item.url);
          if (!id) return null;

          // Height depends on compact mode and type
          let height = "352";
          if (compact) height = "152";
          if (type === 'track') height = "80"; // Tracks are very compact in list view
          
          const Icon = type === 'album' ? Disc : type === 'artist' ? Mic : Music;

          return (
            <div
              key={index}
              className="transition-all duration-300 hover:shadow-lg"
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
              {item.title && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-muted/20">
                    <Icon className="size-5" style={{ color: 'var(--palette-primary)' }} />
                  </div>
                  <h3 
                    className="font-semibold"
                    style={{ color: titleColor }}
                  >
                    {item.title}
                  </h3>
                  <a
                    href={`https://open.spotify.com/${type}/${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto hover:opacity-70 transition-opacity flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-muted/20"
                    style={{ color: descriptionColor }}
                  >
                    <span>Open in Spotify</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              )}
              <div className="rounded-lg overflow-hidden shadow-sm" style={{ borderRadius: borderRadius }}>
                <iframe
                  src={`https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=${theme}`}
                  width="100%"
                  height={height}
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  style={{ borderRadius: borderRadius }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b">
        <h3 className="text-sm font-semibold">Spotify Content</h3>
        <Button onClick={handleAddPlaylist} size="sm" className="h-8 text-xs">
          <Plus className="h-3 w-3 mr-1.5" />
          Add Item
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 bg-muted/20 p-3 rounded-lg">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Theme</label>
          <Select
            value={theme}
            onValueChange={(value) => onUpdate({ ...data, theme: value } as any)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Default</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Display</label>
          <div className="flex items-center justify-between h-8 px-2 border rounded bg-background">
            <span className="text-xs">Compact Mode</span>
            <Switch 
              checked={compact}
              onCheckedChange={(checked) => onUpdate({ ...data, compact: checked } as any)}
              className="scale-75"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {playlists.map((playlist: any, index: number) => {
          const { type } = getSpotifyInfo(playlist.url);
          const Icon = type === 'album' ? Disc : type === 'artist' ? Mic : Music;

          return (
            <div key={index} className="p-3 border border-border rounded-lg space-y-3 bg-background hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-muted-foreground" />
                  <span className="text-xs font-semibold uppercase text-muted-foreground">{type} #{index + 1}</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemovePlaylist(index)}
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="grid gap-2">
                <Input
                  placeholder="Title (Optional)"
                  value={playlist.title || ''}
                  onChange={(e) => handleUpdatePlaylist(index, 'title', e.target.value)}
                  className="h-8 text-xs"
                />
                <Input
                  placeholder="Spotify URL (Playlist, Album, Track, Artist)"
                  value={playlist.url || ''}
                  onChange={(e) => handleUpdatePlaylist(index, 'url', e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
          );
        })}
      </div>

      {playlists.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
          <Music className="size-8 mx-auto mb-2 opacity-20" />
          <p>No Spotify content added</p>
          <Button variant="link" onClick={handleAddPlaylist} className="text-xs">
            Add your first item
          </Button>
        </div>
      )}
      
      <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded text-blue-600 dark:text-blue-400">
        <strong>Tip:</strong> You can paste URLs for Playlists, Albums, Tracks, Artists, or Podcast Episodes.
      </div>
    </div>
  );
}

export default Spotify;
