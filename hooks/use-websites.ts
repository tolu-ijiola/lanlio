"use client";

import { useState, useEffect } from "react";
import { getUserWebsites } from "@/lib/supabase/websites";
import { getCurrentUserId } from "@/lib/supabase/auth";
import { Website } from "@/lib/supabase/types";

export function useWebsites() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWebsites() {
      try {
        setLoading(true);
        setError(null);
        const userId = await getCurrentUserId();
        
        if (!userId) {
          setWebsites([]);
          setLoading(false);
          return;
        }

        const userWebsites = await getUserWebsites(userId);
        setWebsites(userWebsites);
      } catch (err) {
        console.error("Error loading websites:", err);
        setError(err instanceof Error ? err.message : "Failed to load websites");
      } finally {
        setLoading(false);
      }
    }

    loadWebsites();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = await getCurrentUserId();
      
      if (!userId) {
        setWebsites([]);
        setLoading(false);
        return;
      }

      const userWebsites = await getUserWebsites(userId);
      setWebsites(userWebsites);
    } catch (err) {
      console.error("Error refetching websites:", err);
      setError(err instanceof Error ? err.message : "Failed to load websites");
    } finally {
      setLoading(false);
    }
  };

  return { websites, loading, error, refetch };
}



























