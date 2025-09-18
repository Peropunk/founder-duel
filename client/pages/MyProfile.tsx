import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent } from "@/components/ui/card";

export default function MyProfile() {
  const { profile } = useProfile();
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);
  const [coverSrc, setCoverSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!profile) return;
    setAvatarSrc(profile.avatar_url ?? profile.avatar_data ?? undefined);
    setCoverSrc(profile.cover_url ?? profile.cover_data ?? undefined);
  }, [profile]);

  if (!profile) return <div className="container py-12">Loading...</div>;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted py-12">
      <div className="container max-w-3xl">
        <Card>
          <CardContent className="p-0">
            <div className="h-40 w-full overflow-hidden rounded-t-lg bg-muted">
              {coverSrc && <img src={coverSrc} alt="cover" className="h-full w-full object-cover" />}
            </div>
            <div className="p-6 flex items-start gap-6">
              <img src={avatarSrc} alt="avatar" className="h-24 w-24 rounded-lg object-cover border" />
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
