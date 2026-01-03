import { ComponentData, DesignPalette } from '../editor-state';
import { SEOSettings } from '@/components/editor/seo-settings';

export interface Website {
  id: string;
  user_id: string;
  title: string; // Changed from name to title
  slug: string; // Unique subdomain identifier
  domain: string; // Full domain like "johndoe.website.ai"
  status: 'draft' | 'published';
  components: ComponentData[];
  design_palette: DesignPalette;
  seo_settings: SEOSettings;
  description?: string;
  thumbnail?: string;
  views: number;
  unique_visitors: number;
  created_at: string;
  updated_at: string;
}

export interface WebsiteInsert {
  user_id: string;
  title: string; // Changed from name to title
  slug: string;
  domain: string;
  status?: 'draft' | 'published';
  components: ComponentData[];
  design_palette: DesignPalette;
  seo_settings: SEOSettings;
  description?: string;
  thumbnail?: string;
}

export interface WebsiteUpdate {
  title?: string; // Changed from name to title
  status?: 'draft' | 'published';
  components?: ComponentData[];
  design_palette?: DesignPalette;
  seo_settings?: SEOSettings;
  description?: string;
  thumbnail?: string;
}





