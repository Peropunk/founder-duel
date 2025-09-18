import { getSupabaseClient } from "@/lib/supabase";
import type { DbProfile } from "@/lib/db";

export type Challenge = {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: "pending" | "accepted" | "rejected";
  message: string | null;
  created_at: string;
  accepted_at?: string | null;
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

export type ChallengeTask = {
  challenge_id: string;
  day: number;
  task_code: string;
  created_at: string;
};

export type ChallengeTaskProof = {
  id: string;
  challenge_id: string;
  day: number;
  user_id: string;
  proof_url: string | null;
  proof_data: string | null;
  created_at: string;
};

export const TASK_MAP: Record<string, string> = {
  mk_post_video: "Post a promotional video on LinkedIn / X",
  mk_testimonial: "Share a customer testimonial or case study publicly",
  mk_milestone: "Announce a milestone on social media",
  mk_poll: "Create a poll or question post",
  mk_bts: "Post a behind-the-scenes team update",
  pr_launch_feature: "Launch a new feature",
  pr_changelog: "Publish a changelog/update log",
  pr_landing: "Add or improve a landing page",
  pr_demo_video: "Run a small product demo video",
  pr_store_update: "Push an update to App Store / Play Store",
  ua_10_signups: "Get 10 new signups",
  ua_close_customer: "Close 1 paying customer",
  ua_newsletter: "Send a customer newsletter",
  ua_webinar: "Host a live demo / webinar",
  ua_3_testimonials: "Collect 3 new testimonials",
  cc_join_group_intro: "Join a Slack/Discord group and post an intro",
  cc_blog_post: "Write a short blog / Medium post",
  cc_product_hunt: "Publish on Product Hunt / Indie Hackers",
  cc_collab_shoutout: "Collaborate on a shoutout post",
  cc_featured: "Get featured in a newsletter / podcast",
};

export async function getChallengeById(id: string): Promise<Challenge | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Challenge | null;
}

export async function listChallengeTasks(
  challengeId: string,
): Promise<ChallengeTask[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("challenge_tasks")
    .select("*")
    .eq("challenge_id", challengeId)
    .order("day", { ascending: true });
  if (error) throw error;
  return data as ChallengeTask[];
}

export async function listChallengeProofs(
  challengeId: string,
): Promise<ChallengeTaskProof[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("challenge_task_proofs")
    .select("*")
    .eq("challenge_id", challengeId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as ChallengeTaskProof[];
}

export async function uploadTaskProof(
  challengeId: string,
  day: number,
  file: File,
): Promise<ChallengeTaskProof> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase not ready");
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error("Not authenticated");
  let urlOrData: string | null = null;
  try {
    const path = `proofs/${challengeId}/${day}-${Date.now()}-${file.name}`;
    const { error: uploadErr } = await supabase.storage
      .from("avatar")
      .upload(path, file, {
        upsert: true,
        cacheControl: "3600",
        contentType: file.type,
      });
    if (uploadErr) throw uploadErr;
    const { data } = supabase.storage.from("avatar").getPublicUrl(path);
    urlOrData = data.publicUrl ?? null;
  } catch (_e) {
    const buf = await file.arrayBuffer();
    const base64 =
      `data:${file.type};base64,` +
      btoa(String.fromCharCode(...new Uint8Array(buf)));
    urlOrData = base64;
  }
  const isData = (urlOrData ?? "").startsWith("data:");
  const payload: Partial<ChallengeTaskProof> & {
    challenge_id: string;
    day: number;
    user_id: string;
  } = {
    challenge_id: challengeId,
    day,
    user_id: user.id,
    proof_url: isData ? null : urlOrData,
    proof_data: isData ? urlOrData : null,
  };
  const { data: saved, error } = await supabase
    .from("challenge_task_proofs")
    .upsert(payload as any, { onConflict: "challenge_id,day,user_id" })
    .select()
    .single();
  if (error) throw error;
  return saved as ChallengeTaskProof;
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
