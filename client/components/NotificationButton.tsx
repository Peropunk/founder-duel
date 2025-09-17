import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  listMyIncoming,
  respondChallenge,
  type Challenge,
} from "@/lib/challenges";
import { getSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NotificationButton() {
  const [items, setItems] = useState<Challenge[]>([]);

  useEffect(() => {
    let active = true;
    async function load() {
      const list = await listMyIncoming();
      if (active) setItems(list);
    }
    load();
    const supabase = getSupabaseClient();
    const channel = supabase
      ?.channel("notif-bell")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "challenges" },
        (payload) => {
          const row = payload.new as any;
          setItems((p) => [{ ...row }, ...p]);
        },
      )
      .subscribe();
    return () => {
      active = false;
      channel?.unsubscribe();
    };
  }, []);

  async function act(id: string, status: "accepted" | "rejected") {
    await respondChallenge(id, status);
    setItems((p) => p.filter((i) => i.id !== id));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative inline-flex items-center justify-center">
        <Bell className="h-5 w-5" />
        {items.length > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
            {items.length}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {items.length === 0 ? (
          <div className="p-3 text-sm text-muted-foreground">
            No new challenges
          </div>
        ) : (
          items.slice(0, 5).map((c) => (
            <div key={c.id} className="p-2 border-b last:border-0">
              <div className="text-sm">New challenge</div>
              <div className="mt-2 flex gap-2">
                <Link to={`/u/${c.from_user_id}`} className="text-xs underline">
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
            </div>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
