import { useEffect, useMemo, useState } from "react";
import {
  listProfiles,
  createChallenge,
  listMyOutgoingPending,
} from "@/lib/challenges";
import type { DbProfile } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

const CATEGORIES = [
  "All",
  "SaaS",
  "Marketplace",
  "AI",
  "Fintech",
  "DevTools",
  "Consumer",
  "Health",
  "Education",
  "Crypto",
  "Other",
];
const STAGES = [
  "All",
  "Idea",
  "MVP",
  "Pre-Seed",
  "Seed",
  "Series A+",
  "Profitability",
];

export default function ChallengeList() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<DbProfile[]>([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [stage, setStage] = useState("All");
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [outgoing, setOutgoing] = useState<string[]>([]);

  useEffect(() => {
    listProfiles().then(setProfiles).catch(console.error);
  }, []);

  useEffect(() => {
    listMyOutgoingPending().then(setOutgoing).catch(console.error);
  }, [user?.id]);

  const filtered = useMemo(
    () =>
      profiles.filter((p) => {
        if (p.user_id === user?.id) return false; // hide self
        const name = (p.display_name ?? "") + " " + (p.startup_name ?? "");
        const matchQ = q.trim()
          ? name.toLowerCase().includes(q.toLowerCase())
          : true;
        const matchCat = category === "All" || (p.category ?? "") === category;
        const matchStage = stage === "All" || (p.stage ?? "") === stage;
        return matchQ && matchCat && matchStage;
      }),
    [profiles, q, category, stage, user?.id],
  );

  async function onChallenge(target: DbProfile) {
    setSendingId(target.user_id);
    try {
      await createChallenge(target.user_id);
      setOutgoing((prev) => Array.from(new Set([...prev, target.user_id])));
      alert(`Challenge sent to ${target.display_name ?? "user"}`);
    } catch (e: any) {
      alert(e.message ?? "Failed to send challenge");
    } finally {
      setSendingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="w-full md:w-64">
          <Input
            placeholder="Search founders or startups"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            {STAGES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const isSent =
            outgoing.includes(p.user_id) || sendingId === p.user_id;
          return (
            <div
              key={p.user_id}
              className="rounded-lg border bg-card p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.avatar_url ?? p.avatar_data ?? undefined}
                  alt={p.display_name ?? "avatar"}
                  className="h-12 w-12 rounded-md object-cover border bg-muted"
                />
                <div>
                  <div className="font-medium">
                    {p.display_name ?? "Unnamed"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {p.startup_name}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {p.category && (
                  <span className="rounded bg-accent px-2 py-1">
                    {p.category}
                  </span>
                )}
                {p.stage && (
                  <span className="rounded bg-secondary px-2 py-1 text-secondary-foreground">
                    {p.stage}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => onChallenge(p)} disabled={isSent}>
                  {sendingId === p.user_id
                    ? "Sending..."
                    : isSent
                      ? "Sent"
                      : "Challenge"}
                </Button>
                <a href={`/u/${p.user_id}`} className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm">View profile</a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
