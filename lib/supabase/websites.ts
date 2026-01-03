import { supabase } from './client';
import { Website, WebsiteInsert, WebsiteUpdate } from './types';

/**
 * Generate a unique slug from a name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique domain
 */
export async function generateUniqueDomain(slug: string, userId: string): Promise<string> {
  let baseSlug = slug;
  let counter = 1;
  let domain = `${baseSlug}.website.ai`;
  
  // Check if domain exists
  const { data: existing } = await supabase
    .from('websites')
    .select('domain')
    .eq('domain', domain)
    .single();
  
  // If exists, append counter
  if (existing) {
    while (true) {
      domain = `${baseSlug}-${counter}.website.ai`;
      const { data: check } = await supabase
        .from('websites')
        .select('domain')
        .eq('domain', domain)
        .single();
      
      if (!check) break;
      counter++;
    }
  }
  
  return domain;
}

/**
 * Create a new website
 */
export async function createWebsite(data: WebsiteInsert): Promise<Website | null> {
  try {
    // Validate required fields
    if (!data.user_id) {
      console.error('Error: user_id is required');
      return null;
    }
    if (!data.title || data.title.trim().length === 0) {
      console.error('Error: title is required');
      return null;
    }
    if (!data.slug || data.slug.trim().length === 0) {
      console.error('Error: slug is required');
      return null;
    }

    // Generate unique domain if not provided
    if (!data.domain) {
      data.domain = await generateUniqueDomain(data.slug, data.user_id);
    }

    // Ensure components is an array
    if (!Array.isArray(data.components)) {
      data.components = [];
    }

    // Ensure design_palette is an object
    if (!data.design_palette || typeof data.design_palette !== 'object') {
      data.design_palette = {
        primaryColor: '#0f172a',
        backgroundColor: '#ffffff',
        titleColor: '#0f172a',
        descriptionColor: '#64748b',
        fontFamily: 'Inter',
        borderRadius: '8px',
      };
    }

    // Ensure seo_settings is an object
    if (!data.seo_settings || typeof data.seo_settings !== 'object') {
      data.seo_settings = {
        title: '',
        description: '',
        ogImage: '',
        canonicalUrl: '',
      };
    }

    // Prepare insert data - only include fields that exist
    const insertData: any = {
      user_id: data.user_id,
      title: data.title, // Changed from name to title
      slug: data.slug,
      domain: data.domain,
      status: data.status || 'draft',
      components: data.components,
      design_palette: data.design_palette,
      seo_settings: data.seo_settings,
      views: 0,
      unique_visitors: 0,
    };

    // Only include optional fields if they are provided
    if (data.description !== undefined && data.description !== null) {
      insertData.description = data.description;
    }
    if (data.thumbnail !== undefined && data.thumbnail !== null) {
      insertData.thumbnail = data.thumbnail;
    }

    // Handle content column if it exists (required NOT NULL column in some schemas)
    // Store components as JSON string in content field
    insertData.content = JSON.stringify(data.components) || '';
    
    const { data: website, error } = await supabase
      .from('websites')
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating website:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return null;
    }
    
    return website as Website;
  } catch (error) {
    console.error('Exception creating website:', error);
    return null;
  }
}

/**
 * Update a website
 */
export async function updateWebsite(
  id: string,
  updates: WebsiteUpdate
): Promise<Website | null> {
  // Prepare update data
  const updateData: any = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  // If components are being updated, also update content column if it exists
  if (updates.components && Array.isArray(updates.components)) {
    updateData.content = JSON.stringify(updates.components) || '';
  }

  const { data: website, error } = await supabase
    .from('websites')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating website:', error);
    return null;
  }
  
  return website as Website;
}

/**
 * Get website by ID
 */
export async function getWebsiteById(id: string): Promise<Website | null> {
  const { data: website, error } = await supabase
    .from('websites')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching website:', error);
    return null;
  }
  
  return website as Website;
}

/**
 * Get website by domain (for public access)
 */
export async function getWebsiteByDomain(domain: string): Promise<Website | null> {
  const { data: website, error } = await supabase
    .from('websites')
    .select('*')
    .eq('domain', domain)
    .eq('status', 'published')
    .single();
  
  if (error) {
    console.error('Error fetching website by domain:', error);
    return null;
  }
  
  // Increment views
  await supabase
    .from('websites')
    .update({ views: (website.views || 0) + 1 })
    .eq('id', website.id);
  
  return website as Website;
}

/**
 * Get all websites for a user
 */
export async function getUserWebsites(userId: string): Promise<Website[]> {
  const { data: websites, error } = await supabase
    .from('websites')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user websites:', error);
    return [];
  }
  
  return (websites || []) as Website[];
}

/**
 * Delete a website
 */
export async function deleteWebsite(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('websites')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting website:', error);
    return false;
  }
  
  return true;
}





