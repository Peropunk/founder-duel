import { useEffect, useState } from "react";
import {
  listMyIncoming,
  respondChallenge,
  type Challenge,
} from "@/lib/challenges";
import { getSupabaseClient } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotificationBar() {
  const { user } = useAuth();
  const [items, setItems] = useState<Challenge[]>([]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    async function load() {
      const list = await listMyIncoming();
      if (active) setItems(list);
    }
    load();
    const supabase = getSupabaseClient();
    const channel = supabase
      ?.channel("challenges-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "challenges",
          filter: `to_user_id=eq.${user.id}`,
        },
        (payload) => {
          const row = payload.new as any;
          if (row.status === "pending") setItems((p) => [{ ...row }, ...p]);
        },
      )
      .subscribe();
    return () => {
      active = false;
      channel?.unsubscribe();
    };
  }, [user?.id]);

  if (!user || items.length === 0) return null;

  async function act(id: string, status: "accepted" | "rejected") {
    await respondChallenge(id, status);
    setItems((p) => p.filter((i) => i.id !== id));
  }

  return (
    <div className="border-b bg-amber-50 text-amber-900">
      <div className="container py-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="font-medium">
            You have {items.length} challenge{items.length > 1 ? "s" : ""}.
          </div>
          <div className="hidden md:block text-xs text-muted-foreground">
            New challenges appear here in real time.
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {items.slice(0, 3).map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-2">
              <span>New challenge received.</span>
              <Link className="underline" to={`/u/${c.from_user_id}`}>
                View profile
              </Link>
              <div className="ml-auto flex gap-2">
                <Button size="sm" onClick={() => act(c.id, "accepted")}>
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => act(c.id, "rejected")}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
