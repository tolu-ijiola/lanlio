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
  // Generate unique domain if not provided
  if (!data.domain) {
    data.domain = await generateUniqueDomain(data.slug, data.user_id);
  }
  
  const { data: website, error } = await supabase
    .from('websites')
    .insert({
      ...data,
      views: 0,
      unique_visitors: 0,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating website:', error);
    return null;
  }
  
  return website as Website;
}

/**
 * Update a website
 */
export async function updateWebsite(
  id: string,
  updates: WebsiteUpdate
): Promise<Website | null> {
  const { data: website, error } = await supabase
    .from('websites')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
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





