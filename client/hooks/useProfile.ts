import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DbProfile, fetchMyProfile, upsertMyProfile } from "@/lib/db";

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function run() {
      if (!user) return;
      setLoading(true);
      try {
        const data = await fetchMyProfile(user.id);
        if (!mounted) return;
        if (data) setProfile(data);
        else setProfile({
          user_id: user.id,
          display_name: user.name ?? user.email ?? "",
          startup_name: "",
          category: "",
          stage: "",
          website: "",
          twitter: "",
          linkedin: "",
          github: "",
          avatar_url: user.avatarUrl ?? null,
          avatar_data: null,
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => { mounted = false; };
  }, [user?.id]);

  const save = useCallback(async (data: DbProfile) => {
    const saved = await upsertMyProfile(data);
    setProfile(saved);
    return saved;
  }, []);

  return { user, profile, setProfile, save, loading } as const;
}
