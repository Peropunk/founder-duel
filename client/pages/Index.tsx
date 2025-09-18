import { DemoResponse } from "@shared/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ChallengeList from "@/components/ChallengeList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Trophy, Users, Zap, Target, TrendingUp, CheckCircle } from "lucide-react";

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {!user && (
        <>
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
            
            <div className="container relative grid lg:grid-cols-2 items-center gap-12 py-20 lg:py-32">
              {/* FIX: Added 'min-w-0' to allow this grid column to shrink properly, preventing the content from overflowing and being cut off. */}
              <div className="space-y-8 min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary ring-1 ring-primary/20 animate-fade-in">
                  <Zap className="w-4 h-4" />
                  Challenge-driven growth
                </div>
                
                <div className="space-y-4">
                  <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary/80 bg-clip-text text-transparent break-all lg:break-normal">
                    FounderDuel
                  </h1>
                  <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground">
                    Compete on startup growth
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-prose leading-relaxed">
                    Pit founders head-to-head on metrics that matter. Track progress,
                    set public challenges, and accelerate growth through friendly competition.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="group h-14 px-8 text-lg" asChild>
                    <a href="/auth">
                      Start Competing
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg" asChild>
                    <a href="/profile">
                      Create Profile
                    </a>
                  </Button>
                </div>

                {/* Social Proof */}
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary border-2 border-background" />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">100+</span> founders already competing
                  </div>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="relative lg:justify-self-end">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-3xl rounded-3xl" />
                  
                  {/* Main card */}
                  <Card className="relative border-0 shadow-2xl bg-card/90 backdrop-blur-xl">
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="px-3 py-1">
                            <Trophy className="w-4 h-4 mr-1" />
                            Live Challenge
                          </Badge>
                          <div className="text-sm text-muted-foreground">Day 2/3</div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold">Growth Sprint Challenge</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 rounded-lg bg-primary/10">
                              <div className="text-2xl font-bold text-primary">47</div>
                              <div className="text-xs text-muted-foreground">New signups</div>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-secondary/10">
                              <div className="text-2xl font-bold text-secondary">23</div>
                              <div className="text-xs text-muted-foreground">Features shipped</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                            <span className="text-sm font-medium">Sarah K.</span>
                          </div>
                          <div className="text-sm text-muted-foreground">vs</div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
                            <span className="text-sm font-medium">Mike R.</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-muted/30">
            <div className="container space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Why founders choose FounderDuel</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Turn competition into acceleration. Build faster, ship more, grow together.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                  icon={<Target className="w-12 h-12" />}
                  title="Targeted Challenges"
                  description="Compete on what matters most - growth metrics, feature launches, customer acquisition, and revenue milestones."
                  gradient="from-blue-500 to-purple-600"
                />
                <FeatureCard
                  icon={<Users className="w-12 h-12" />}
                  title="Build in Public"
                  description="Share your journey transparently. Connect your startup, social profiles, and track progress publicly."
                  gradient="from-purple-500 to-pink-600"
                />
                <FeatureCard
                  icon={<TrendingUp className="w-12 h-12" />}
                  title="Accelerated Growth"
                  description="Healthy rivalry that drives results. Learn from peers, stay accountable, and achieve more together."
                  gradient="from-orange-500 to-red-600"
                />
              </div>
            </div>
          </section>

          {/* How it Works */}
          <section className="py-20">
            <div className="container space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Simple 3-day challenges that drive real results
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <StepCard
                  step="01"
                  title="Challenge a Founder"
                  description="Pick a fellow founder and send them a growth challenge. Set the stakes, choose the metrics."
                />
                <StepCard
                  step="02"
                  title="Compete for 3 Days"
                  description="Both founders work on daily tasks - from marketing posts to feature launches to customer calls."
                />
                <StepCard
                  step="03"
                  title="Share & Learn"
                  description="Upload proof of your work, learn from each other, and celebrate the wins together."
                />
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
            <div className="container text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Ready to level up your startup?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join hundreds of founders who are already using competition to accelerate their growth.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="h-14 px-8 text-lg" asChild>
                  <a href="/auth">
                    Start Your First Challenge
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg" asChild>
                  <a href="/profile">
                    Set Up Profile
                  </a>
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Free to use
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Google sign-in
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Public profiles
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Social integration
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {user && (
        <section className="py-20 bg-gradient-to-b from-background to-muted">
          <div className="container space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Your Dashboard</h2>
                <p className="text-muted-foreground">Challenge other founders and track your progress</p>
              </div>
              <Button asChild>
                <a href="/challenges">
                  View Active Challenges
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
            <ChallengeList />
          </div>
        </section>
      )}
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  gradient 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  gradient: string;
}) {
  return (
    <Card className="group relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:scale-105">
      <CardContent className="p-8 space-y-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${gradient} p-3 text-white group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    </Card>
  );
}

function StepCard({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="relative">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center">
          {step}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
