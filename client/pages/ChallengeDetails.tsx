import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  getChallengeById,
  listChallengeTasks,
  listChallengeProofs,
  uploadTaskProof,
  TASK_MAP,
  type Challenge,
  type ChallengeTask,
  type ChallengeTaskProof,
} from "@/lib/challenges";
import { Button } from "@/components/ui/button";

function formatTask(code: string) {
  return TASK_MAP[code] ?? code;
}

export default function ChallengeDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [tasks, setTasks] = useState<ChallengeTask[]>([]);
  const [proofs, setProofs] = useState<ChallengeTaskProof[]>([]);
  const [uploadingDay, setUploadingDay] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!id) return;
      const [c, t, p] = await Promise.all([
        getChallengeById(id),
        listChallengeTasks(id),
        listChallengeProofs(id),
      ]);
      if (!active) return;
      setChallenge(c);
      setTasks(t);
      setProofs(p);
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const startAt = useMemo(() => {
    if (!challenge) return null;
    return challenge.accepted_at
      ? new Date(challenge.accepted_at)
      : new Date(challenge.created_at);
  }, [challenge]);

  const todayIndex = useMemo(() => {
    if (!startAt) return null;
    const ms = Date.now() - startAt.getTime();
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    return Math.min(2, Math.max(0, days)); // 0..2 for 3 days
  }, [startAt]);

  const ended = useMemo(() => {
    if (!startAt) return false;
    const ms = Date.now() - startAt.getTime();
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    return days >= 3;
  }, [startAt]);

  function myProofFor(day: number) {
    if (!user) return undefined;
    return proofs.find((p) => p.day === day && p.user_id === user.id);
  }

  async function onFileSelected(
    day: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    setUploadingDay(day);
    try {
      await uploadTaskProof(id, day, file);
      const p = await listChallengeProofs(id);
      setProofs(p);
    } finally {
      setUploadingDay(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted py-12">
      <div className="container max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold">Challenge Details</h1>
        {!challenge ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="text-sm text-muted-foreground">
              Starts {startAt?.toLocaleString()} • Ends{" "}
              {startAt &&
                new Date(
                  startAt.getTime() + 3 * 24 * 60 * 60 * 1000,
                ).toLocaleString()}
            </div>
            <div className="grid gap-4">
              {tasks.map((t) => {
                const idx = t.day - 1;
                const my = myProofFor(t.day);
                const canUpload =
                  !ended && todayIndex !== null && idx <= todayIndex && !my;
                return (
                  <div
                    key={t.day}
                    className="rounded-lg border bg-card p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Day {t.day}</div>
                      {my && (
                        <span className="text-xs text-green-600">
                          Submitted
                        </span>
                      )}
                    </div>
                    <div className="text-sm">{formatTask(t.task_code)}</div>
                    <div className="flex items-center gap-3">
                      {canUpload ? (
                        <>
                          <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => onFileSelected(t.day, e)}
                          />
                          <Button
                            disabled={uploadingDay === t.day}
                            onClick={() => fileRef.current?.click()}
                          >
                            {uploadingDay === t.day
                              ? "Uploading..."
                              : "Upload proof"}
                          </Button>
                        </>
                      ) : (
                        <Button disabled variant="secondary">
                          {ended
                            ? "Ended"
                            : my
                              ? "Submitted"
                              : idx > (todayIndex ?? -1)
                                ? "Opens soon"
                                : "Unavailable"}
                        </Button>
                      )}
                    </div>
                    {/* Show all proofs for this day */}
                    <div className="mt-2 flex flex-wrap gap-3">
                      {proofs
                        .filter((p) => p.day === t.day)
                        .map((p) => (
                          <img
                            key={p.id}
                            src={p.proof_url ?? p.proof_data ?? undefined}
                            alt="proof"
                            className="h-24 w-24 object-cover rounded border bg-muted"
                          />
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
