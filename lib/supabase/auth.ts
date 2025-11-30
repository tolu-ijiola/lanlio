import { supabase } from './client';

/**
 * Get current user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

/**
 * Get current user session
 */
export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string, metadata?: { firstName?: string; lastName?: string }) {
  const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata || {},
      emailRedirectTo: redirectTo,
    },
  });
  
  return { data, error };
}

/**
 * Reset password (send reset email)
 */
export async function resetPassword(email: string) {
  const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined;
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo,
  });
  
  return { data, error };
}

/**
 * Sign out
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Sign in with OAuth provider
 */
export async function signInWithOAuth(provider: 'google' | 'linkedin') {
  const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined;
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectTo,
    },
  });
  
  return { data, error };
}

/**
 * Resend email confirmation
 */
export async function resendEmailConfirmation(email: string) {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  });
  
  return { data, error };
}
