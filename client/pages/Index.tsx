import { DemoResponse } from "@shared/api";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import ChallengeList from "@/components/ChallengeList";

export default function Index() {
  const { user } = useAuth();
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted">
      <section className="container grid lg:grid-cols-2 items-center gap-8 py-16">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20">Challenge-driven growth</span>
          <h1 className="font-display text-4xl md:text-5xl leading-tight">FounderDuel — Compete on startup growth</h1>
          <p className="text-muted-foreground max-w-prose">Pit founders head-to-head on metrics that matter. Track progress, set public challenges, and grow faster together.</p>
          <div className="flex gap-3">
            {!user && <a href="/auth" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-primary-foreground shadow hover:bg-primary/90">Login / Sign up</a>}
            <a href="/profile" className="inline-flex h-11 items-center justify-center rounded-md border px-6">Create your profile</a>
          </div>
          <ul className="grid grid-cols-2 gap-4 pt-4 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary"/> Google login</li>
            <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary"/> Founder profiles</li>
            <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary"/> Public status</li>
            <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary"/> Social links</li>
          </ul>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 -z-10 bg-gradient-to-tr from-primary/20 via-secondary/20 to-accent/20 blur-3xl" />
          <img src="https://cdn.builder.io/api/v1/image/assets%2F462fdc1538bd468b99eec373dc088499%2F145889f40d2c4fc2b66976c7dd17929e?format=webp&width=800" alt="FounderDuel logo" className="w-full h-auto drop-shadow-2xl" />
        </div>
      </section>

      {user && (
        <section className="border-t py-10">
          <div className="container space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Challenge Founders</h2>
            </div>
            <ChallengeList />
          </div>
        </section>
      )}

      <section className="border-t py-10">
        <div className="container grid md:grid-cols-3 gap-6">
          <Feature title="Make it a duel" desc="Challenge another founder on growth, revenue, shipping streaks and more." />
          <Feature title="Build in public" desc="Share your status with links to your startup and socials." />
          <Feature title="Win together" desc="Healthy rivalry that accelerates learning and momentum." />
        </div>
      </section>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
