"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditorRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to /editor/new for new websites
    router.push('/editor/new');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Redirecting to editor...</p>
      </div>
    </div>
  );
}
