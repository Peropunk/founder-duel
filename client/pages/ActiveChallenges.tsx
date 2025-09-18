import { useEffect, useState } from "react";
import {
  listMyActiveAccepted,
  type ChallengeWithProfiles,
} from "@/lib/challenges";

export default function ActiveChallenges() {
  const [items, setItems] = useState<ChallengeWithProfiles[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await listMyActiveAccepted();
        if (active) setItems(res);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted py-12">
      <div className="container max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold">Active Challenges</h1>
        {loading ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No active challenges yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map(({ challenge, from, to }) => (
              <div key={challenge.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <a
                      href={`/u/${from?.user_id ?? ""}`}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={from?.avatar_url ?? from?.avatar_data ?? undefined}
                        className="h-10 w-10 rounded object-cover border bg-muted"
                        alt={from?.display_name ?? "avatar"}
                      />
                      <div className="leading-tight">
                        <div className="font-medium text-sm">
                          {from?.display_name ?? "Unknown"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {from?.startup_name}
                        </div>
                      </div>
                    </a>
                    <span className="text-muted-foreground text-sm">vs</span>
                    <a
                      href={`/u/${to?.user_id ?? ""}`}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={to?.avatar_url ?? to?.avatar_data ?? undefined}
                        className="h-10 w-10 rounded object-cover border bg-muted"
                        alt={to?.display_name ?? "avatar"}
                      />
                      <div className="leading-tight">
                        <div className="font-medium text-sm">
                          {to?.display_name ?? "Unknown"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {to?.startup_name}
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Started{" "}
                    {new Date(challenge.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
