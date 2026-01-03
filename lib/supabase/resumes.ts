import { supabase } from './client';
import { getCurrentUserId } from './auth';

export interface ResumeData {
  id?: string;
  user_id: string;
  name: string;
  full_name: string;
  email: string;
  phone: string;
  job_title: string;
  experience: string;
  location: string;
  bio: string;
  skills: string[];
  education: string;
  work_history: string;
  file_url?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Upload resume file to Supabase Storage
 */
export async function uploadResumeFile(file: File, userId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading resume file:', error);
    return null;
  }
}

/**
 * Extract text from resume file (PDF or DOCX)
 * Note: This requires server-side libraries. For client-side, use a service or API.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  // For client-side, we'll need to send the file to an API route
  // that can handle PDF/DOCX parsing with proper libraries
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/resume/extract-text', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to extract text');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error extracting text:', error);
    throw error;
  }
}

/**
 * Create a new resume
 */
export async function createResume(resume: Omit<ResumeData, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ResumeData | null> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('resumes')
      .insert({
        ...resume,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating resume:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating resume:', error);
    return null;
  }
}

/**
 * Update an existing resume
 */
export async function updateResume(id: string, resume: Partial<ResumeData>): Promise<ResumeData | null> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('resumes')
      .update({
        ...resume,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating resume:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error updating resume:', error);
    return null;
  }
}

/**
 * Get all resumes for current user
 */
export async function getResumes(): Promise<ResumeData[]> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resumes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return [];
  }
}

/**
 * Delete a resume
 */
export async function deleteResume(id: string): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return false;
    }

    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting resume:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting resume:', error);
    return false;
  }
}

