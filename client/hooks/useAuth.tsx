import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export type AuthUser = {
  id: string;
  email: string | null;
  avatarUrl?: string | null;
  name?: string | null;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        if (!supabase) return; // no env configured
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email ?? null,
            avatarUrl: session.user.user_metadata?.avatar_url,
            name: session.user.user_metadata?.name,
          });
        }
        supabase.auth.onAuthStateChange((_event, sessionUpdate) => {
          if (!mounted) return;
          if (sessionUpdate?.user) {
            setUser({
              id: sessionUpdate.user.id,
              email: sessionUpdate.user.email ?? null,
              avatarUrl: sessionUpdate.user.user_metadata?.avatar_url,
              name: sessionUpdate.user.user_metadata?.name,
            });
          } else {
            setUser(null);
          }
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => { mounted = false; };
  }, [supabase]);

  const value = useMemo(() => ({
    user,
    loading,
    signOut: async () => { if (supabase) await supabase.auth.signOut(); },
    signInWithGoogle: async () => {
      if (!supabase) throw new Error("Supabase env not configured");
      const redirectTo = window.location.origin + "/profile";
      await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
    },
  }), [user, loading, supabase]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
