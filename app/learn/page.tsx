"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Bookmark, Clock3, Sparkles } from "lucide-react";

const categories = [
  "Portfolio Basics",
  "Messaging",
  "Interview Prep",
  "Outreach",
  "Product Updates",
];

const resourceArticles = [
  {
    title: "Upload to portfolio in under 30 minutes",
    summary:
      "Use the guided import checklist to move from PDF to polished site without touching code.",
    author: "Camille Ortiz",
    role: "Customer Success Lead",
    date: "Jan 12, 2025",
    readTime: "6 min",
    tag: "Portfolio Basics",
  },
  {
    title: "Write role-ready copy that feels human",
    summary:
      "A simple headline + proof formula that keeps your voice while surfacing impact metrics.",
    author: "Noah Lee",
    role: "Brand Strategist",
    date: "Jan 08, 2025",
    readTime: "5 min",
    tag: "Messaging",
  },
  {
    title: "Keep recruiters warm between interviews",
    summary:
      "Plug-and-play follow-up scripts plus a light tracker to log responses across channels.",
    author: "Priya Nair",
    role: "Talent Advisor",
    date: "Jan 04, 2025",
    readTime: "4 min",
    tag: "Outreach",
  },
  {
    title: "Prep faster with the interview mode dashboard",
    summary:
      "Mirror the questions you’ll hear on the loop and link each answer back to live pages.",
    author: "Leo Grant",
    role: "Product Marketing",
    date: "Dec 30, 2024",
    readTime: "7 min",
    tag: "Interview Prep",
  },
];

const spotlightGuides = [
  {
    title: "Starter Layouts",
    description: "Curated sections for design, product, and revenue roles.",
    action: "Browse layouts",
  },
  {
    title: "Story Builder",
    description: "Three prompts to turn bullets into proof-backed narratives.",
    action: "Use template",
  },
  {
    title: "Hiring Pulse",
    description: "Weekly cadence of outreach, follow-ups, and check-ins.",
    action: "Open tracker",
  },
];

export default function LearnResourcesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20">
      <div className="max-w-5xl mx-auto px-4 space-y-12">
        <section className="text-center space-y-4">
          <Badge variant="secondary" className="mx-auto w-fit">
            Learn / Resources
          </Badge>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Browse resources that keep you moving from upload to hired.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every guide mirrors the experience inside the editor—clean steps,
            premium content, and zero fluff.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "Portfolio Basics" ? "default" : "outline"}
                className="px-4 py-2 text-sm"
              >
                {category}
              </Badge>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {resourceArticles.map((article) => (
            <Card key={article.title} className="border border-border/70">
              <CardHeader className="gap-3">
                <Badge variant="secondary" className="w-fit">
                  {article.tag}
                </Badge>
                <CardTitle className="text-2xl leading-tight">
                  {article.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {article.summary}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage alt={article.author} />
                    <AvatarFallback className="text-xs">
                      {article.author
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">
                      {article.author}
                    </p>
                    <p>{article.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  <span>{article.readTime}</span>
                  <span className="text-border">•</span>
                  <span>{article.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="bg-card border border-border rounded-3xl p-8 space-y-6">
          <div className="flex flex-col gap-3 text-center">
            <Badge variant="secondary" className="mx-auto w-fit">
              Quick tools
            </Badge>
            <h2 className="text-3xl font-semibold">Guides built into the workflow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pick a guide and jump straight into the editor with the steps pinned to your canvas.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {spotlightGuides.map((guide) => (
              <div
                key={guide.title}
                className="rounded-2xl border border-border/70 bg-linear-to-br from-muted to-background p-5 space-y-3"
              >
                <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                  <span>{guide.title}</span>
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <p className="text-base text-foreground">{guide.description}</p>
                <Button variant="ghost" className="px-0 text-primary hover:text-primary/80 w-fit">
                  {guide.action}
                  <Bookmark className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-primary text-primary-foreground p-10 text-center space-y-4">
          <Badge variant="secondary" className="mx-auto w-fit text-primary">
            Weekly drop
          </Badge>
          <h2 className="text-3xl font-semibold">
            New playbooks land every Monday inside the editor.
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Subscribe once and get a quiet nudge when a new workflow, template, or interview tool goes live.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-primary">
              Get notified
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              View previous drops
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
