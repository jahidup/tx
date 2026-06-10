"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Brain,
  CalendarClock,
  FileCheck2,
  LockKeyhole,
  Medal,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Role-based portals", value: "2" },
  { label: "Core workflows", value: "40+" },
  { label: "Result time", value: "Instant" },
  { label: "AI mode", value: "After publish" }
];

const features = [
  { title: "Secure test engine", icon: LockKeyhole, text: "JWT sessions, autosave, countdown, review palette and auto-submit on time end." },
  { title: "Admin control room", icon: BarChart3, text: "Classes, students, question bank, tests, rank lists, PDFs, emails and settings." },
  { title: "AI learning assistant", icon: Brain, text: "Gemini explanations with Hindi, English, Hinglish and similar-question practice." },
  { title: "Cloud-ready storage", icon: UploadCloud, text: "Cloudinary support for profile photos, question images, solution images and PDFs." }
];

export function HomePage() {
  return (
    <main>
      <section
        className="relative overflow-hidden bg-slate-950 text-white"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(6, 24, 31, 0.92), rgba(6, 24, 31, 0.56)), url(https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1800&q=80)",
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
      >
        <div className="container grid min-h-[78vh] items-center py-20 md:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <Badge variant="secondary" className="border-0">
              <Sparkles className="mr-1 size-3" />
              Enterprise Online Examination Platform
            </Badge>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Sankalp Digital Pathshala Test Portal
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-200">
              A production-ready LMS and exam system for admin-created students, live tests, instant
              results, rank lists, study material and safe AI explanations after publication.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="secondary">
                <Link href="/student-login">
                  Student Login
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link href="/admin-login">Admin Portal</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mt-12 hidden rounded-lg border border-white/15 bg-white/10 p-4 shadow-soft backdrop-blur md:block"
          >
            <div className="grid gap-3">
              {[
                ["Live Test", "Mathematics Weekly Test 01", CalendarClock],
                ["Result Published", "Science Weekly Test 02", Medal],
                ["AI Review", "Step-by-step explanation enabled", Brain]
              ].map(([label, title, Icon]) => (
                <div key={String(title)} className="flex items-center gap-3 rounded-md bg-white/12 p-4">
                  <span className="grid size-11 place-items-center rounded-md bg-emerald-400 text-slate-950">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase text-slate-300">{String(label)}</p>
                    <p className="font-semibold">{String(title)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b bg-card">
        <div className="container grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border bg-background p-5">
              <p className="text-3xl font-semibold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <div className="max-w-2xl">
          <Badge variant="outline">Platform Modules</Badge>
          <h2 className="mt-3 text-3xl font-semibold">Built around real exam operations</h2>
          <p className="mt-3 text-muted-foreground">
            The portal uses dedicated pages and structured workflows instead of popup-heavy forms, so
            administrators and students can work quickly on desktop and mobile.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <span className="grid size-11 place-items-center rounded-md bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </span>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-card py-16">
        <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Badge variant="secondary">AI Learning Assistant</Badge>
            <h2 className="mt-3 text-3xl font-semibold">Gemini explanations only after results are published</h2>
            <p className="mt-3 text-muted-foreground">
              During live tests, AI is disabled. After publication, students can open a dedicated AI
              explanation page for each reviewed question and receive step-by-step learning support.
            </p>
            <div className="mt-6 grid gap-3 text-sm">
              {["Mistake analysis", "Hindi, English and Hinglish explanations", "Similar question generation"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Student-safe review", Brain],
              ["Question image support", FileCheck2],
              ["Study material library", BookOpenCheck],
              ["Rank list controls", Users]
            ].map(([label, Icon]) => (
              <div key={String(label)} className="rounded-lg border bg-background p-5">
                <Icon className="size-6 text-primary" />
                <p className="mt-3 font-medium">{String(label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
