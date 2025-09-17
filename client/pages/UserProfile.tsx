import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSupabaseClient } from "@/lib/supabase";
import type { DbProfile } from "@/lib/db";

export default function UserProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<DbProfile | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase || !id) return;
    supabase.from("profiles").select("*").eq("user_id", id).maybeSingle().then(({ data }) => setProfile(data as any));
  }, [id]);

  if (!profile) return <div className="container py-12">Loading...</div>;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted py-12">
      <div className="container max-w-3xl">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-start gap-6">
            <img src={profile.avatar_url ?? profile.avatar_data ?? undefined} alt="avatar" className="h-24 w-24 rounded-lg object-cover border" />
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">{profile.display_name}</h1>
              <p className="text-muted-foreground">{profile.startup_name}</p>
              <div className="flex gap-2 text-xs">
                {profile.category && <span className="rounded bg-accent px-2 py-1">{profile.category}</span>}
                {profile.stage && <span className="rounded bg-secondary px-2 py-1 text-secondary-foreground">{profile.stage}</span>}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                {profile.website && <a className="underline" href={profile.website} target="_blank">Website</a>}
                {profile.twitter && <a className="underline" href={profile.twitter} target="_blank">Twitter</a>}
                {profile.linkedin && <a className="underline" href={profile.linkedin} target="_blank">LinkedIn</a>}
                {profile.github && <a className="underline" href={profile.github} target="_blank">GitHub</a>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
