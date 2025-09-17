import { getSupabaseClient } from "@/lib/supabase";
import type { DbProfile } from "@/lib/db";

export type Challenge = {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: "pending" | "accepted" | "rejected";
  message: string | null;
  created_at: string;
};

export async function listProfiles(): Promise<DbProfile[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("profiles").select("*");
  if (error) throw error;
  return data as DbProfile[];
}

export async function createChallenge(toUserId: string, message?: string) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase not ready");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("challenges")
    .insert({
      from_user_id: user.id,
      to_user_id: toUserId,
      message: message ?? null,
    });
  if (error) throw error;
}

export async function listMyIncoming(): Promise<Challenge[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("to_user_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Challenge[];
}

export async function respondChallenge(
  id: string,
  status: "accepted" | "rejected",
) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase not ready");
  const { error } = await supabase
    .from("challenges")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}
