import { getSupabaseClient } from "@/lib/supabase";

export type DbProfile = {
  user_id: string;
  display_name: string | null;
  startup_name: string | null;
  category: string | null;
  stage: string | null;
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  github: string | null;
  avatar_url: string | null;
  avatar_data: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export async function fetchMyProfile(userId: string): Promise<DbProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as DbProfile | null;
}

export async function upsertMyProfile(profile: DbProfile) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.from("profiles").upsert(profile, { onConflict: "user_id" }).select().single();
  if (error) throw error;
  return data as DbProfile;
}

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  try {
    const path = `${userId}/${Date.now()}-${file.name}`;
    const { error: uploadErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, cacheControl: "3600", contentType: file.type });
    if (uploadErr) throw uploadErr;
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    return data.publicUrl ?? null;
  } catch (_e) {
    try {
      const buf = await file.arrayBuffer();
      const base64 = `data:${file.type};base64,` + btoa(String.fromCharCode(...new Uint8Array(buf)));
      return base64; // fallback returned; caller will decide whether it's url or data
    } catch {
      return null;
    }
  }
}
