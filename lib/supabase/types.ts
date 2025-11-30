import { ComponentData, DesignPalette } from '../editor-state';
import { SEOSettings } from '../components/editor/seo-settings';

export interface Website {
  id: string;
  user_id: string;
  name: string;
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
  name: string;
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
  name?: string;
  status?: 'draft' | 'published';
  components?: ComponentData[];
  design_palette?: DesignPalette;
  seo_settings?: SEOSettings;
  description?: string;
  thumbnail?: string;
}





