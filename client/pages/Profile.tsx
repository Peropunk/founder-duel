import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadProfile, saveProfile, type Profile } from "@/lib/storage";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    companyWebsite: "",
    twitter: "",
    linkedin: "",
    github: "",
    status: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = loadProfile();
    if (existing) setProfile(existing);
  }, []);

  const onSave = () => {
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted py-12">
      <div className="container max-w-3xl">
        <Card className="border-border/60 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-3xl">Founder Profile</CardTitle>
            <CardDescription>Add your company website, social links and current status.</CardDescription>
          </CardHeader>
          <CardContent>
            {!user && (
              <div className="mb-6 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                You are not logged in. <Link className="text-primary underline" to="/auth">Login with Google</Link> for a synced experience, otherwise your data is saved locally in the browser.
              </div>
            )}
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="companyWebsite">Company website</Label>
                <Input id="companyWebsite" placeholder="https://yourcompany.com" value={profile.companyWebsite} onChange={(e)=>setProfile({ ...profile, companyWebsite: e.target.value })} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <Input id="twitter" placeholder="https://x.com/yourhandle" value={profile.twitter} onChange={(e)=>setProfile({ ...profile, twitter: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" placeholder="https://linkedin.com/in/you" value={profile.linkedin} onChange={(e)=>setProfile({ ...profile, linkedin: e.target.value })} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input id="github" placeholder="https://github.com/you" value={profile.github} onChange={(e)=>setProfile({ ...profile, github: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Current status</Label>
                  <Textarea id="status" placeholder="Raising seed, $25k MRR, hiring, etc." value={profile.status} onChange={(e)=>setProfile({ ...profile, status: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={onSave}>{saved ? "Saved" : "Save"}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
