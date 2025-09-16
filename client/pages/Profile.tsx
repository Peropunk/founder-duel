import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { uploadAvatar } from "@/lib/db";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = ["SaaS","Marketplace","AI","Fintech","DevTools","Consumer","Health","Education","Crypto","Other"];
const STAGES = ["Idea","MVP","Pre-Seed","Seed","Series A+","Profitability"];

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, setProfile, save } = useProfile();
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => { /* ensure hook loads profile */ }, []);

  const avatarSrc = useMemo(() => profile?.avatar_url ?? profile?.avatar_data ?? undefined, [profile]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!profile || !user) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const urlOrData = await uploadAvatar(user.id, file);
    if (!urlOrData) return;
    const isData = urlOrData.startsWith("data:");
    setProfile({ ...profile, avatar_url: isData ? null : urlOrData, avatar_data: isData ? urlOrData : null });
  }

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    try {
      await save(profile);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted py-12">
      <div className="container max-w-3xl">
        <Card className="border-border/60 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-3xl">Profile dashboard</CardTitle>
            <CardDescription>Add your photo, founder and startup details. Saved to Supabase.</CardDescription>
          </CardHeader>
          <CardContent>
            {!user && (
              <div className="mb-6 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                Please <Link className="text-primary underline" to="/auth">Login</Link> to save your profile in the cloud.
              </div>
            )}

            {!profile ? (
              <div>Loading...</div>
            ) : (
              <div className="grid gap-8">
                <div className="flex items-center gap-6">
                  <img src={avatarSrc} className="h-24 w-24 rounded-lg object-cover border bg-muted" alt="avatar" />
                  <div className="space-x-2">
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    <Button onClick={() => fileRef.current?.click()} variant="secondary">Upload photo</Button>
                    <Button onClick={() => setProfile({ ...profile, avatar_url: null, avatar_data: null })} variant="ghost">Remove</Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="display_name">Founder name</Label>
                    <Input id="display_name" value={profile.display_name ?? ""} onChange={(e)=>setProfile({ ...profile, display_name: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="startup">Startup name</Label>
                    <Input id="startup" value={profile.startup_name ?? ""} onChange={(e)=>setProfile({ ...profile, startup_name: e.target.value })} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Category</Label>
                    <Select value={profile.category ?? ""} onValueChange={(v)=>setProfile({ ...profile, category: v })}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c)=> (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Stage</Label>
                    <Select value={profile.stage ?? ""} onValueChange={(v)=>setProfile({ ...profile, stage: v })}>
                      <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                      <SelectContent>
                        {STAGES.map((s)=> (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="website">Company website</Label>
                    <Input id="website" placeholder="https://yourcompany.com" value={profile.website ?? ""} onChange={(e)=>setProfile({ ...profile, website: e.target.value })} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="twitter">Twitter / X</Label>
                      <Input id="twitter" placeholder="https://x.com/yourhandle" value={profile.twitter ?? ""} onChange={(e)=>setProfile({ ...profile, twitter: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input id="linkedin" placeholder="https://linkedin.com/in/you" value={profile.linkedin ?? ""} onChange={(e)=>setProfile({ ...profile, linkedin: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="github">GitHub</Label>
                      <Input id="github" placeholder="https://github.com/you" value={profile.github ?? ""} onChange={(e)=>setProfile({ ...profile, github: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="ghost" onClick={()=>navigate("/me")}>View my profile</Button>
                  <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
