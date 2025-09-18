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
  // Require sender to have website and X (twitter) set
  const { data: me, error: meErr } = await supabase
    .from("profiles")
    .select("website,twitter")
    .eq("user_id", user.id)
    .maybeSingle();
  if (meErr) throw meErr;
  const website = (me as any)?.website?.trim();
  const twitter = (me as any)?.twitter?.trim();
  if (!website || !twitter) {
    throw new Error(
      "Add your website and X account link in Profile to send a battle request.",
    );
  }
  const { error } = await supabase.from("challenges").insert({
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

export async function listMyOutgoingPending(): Promise<string[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("challenges")
    .select("to_user_id")
    .eq("from_user_id", user.id)
    .eq("status", "pending");
  if (error) throw error;
  return (data ?? []).map((r: any) => r.to_user_id as string);
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

export type ChallengeWithProfiles = {
  challenge: Challenge;
  from: DbProfile | null;
  to: DbProfile | null;
};

export async function listMyActiveAccepted(): Promise<ChallengeWithProfiles[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: challenges, error } = await supabase
    .from("challenges")
    .select("*")
    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
    .eq("status", "accepted")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const ids = Array.from(
    new Set([
      ...((challenges ?? []) as any[]).map((c) => c.from_user_id),
      ...((challenges ?? []) as any[]).map((c) => c.to_user_id),
    ]),
  ).filter(Boolean);
  if (ids.length === 0) return [];
  const { data: profiles, error: pErr } = await supabase
    .from("profiles")
    .select("*")
    .in("user_id", ids as string[]);
  if (pErr) throw pErr;
  const byId = Object.fromEntries(
    (profiles as any[]).map((p) => [p.user_id, p as DbProfile]),
  );
  return (challenges as any[]).map((c) => ({
    challenge: c as Challenge,
    from: byId[c.from_user_id] ?? null,
    to: byId[c.to_user_id] ?? null,
  }));
}
