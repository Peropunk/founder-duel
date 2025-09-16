import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

export default function AuthPage() {
  const { signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted flex items-center justify-center py-16">
      <Card className="w-full max-w-md border-border/60 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-3xl">Welcome to FounderDuel</CardTitle>
          <CardDescription>Login or create an account to start challenging founders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                </div>
                <Button className="w-full" disabled>Continue (email/password coming soon)</Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <Button onClick={signInWithGoogle} variant="secondary" className="w-full">Sign in with Google</Button>
                <p className="text-xs text-muted-foreground text-center">Google login requires Supabase credentials (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) configured in env.</p>
              </div>
            </TabsContent>
            <TabsContent value="signup">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email2">Email</Label>
                  <Input id="email2" type="email" placeholder="you@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password2">Password</Label>
                  <Input id="password2" type="password" />
                </div>
                <Button className="w-full" disabled>Create account (coming soon)</Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <Button onClick={signInWithGoogle} variant="secondary" className="w-full">Continue with Google</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
