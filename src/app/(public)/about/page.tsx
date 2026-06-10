import { Award, CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  const values = [
    { title: "Admin-created students only", icon: Users },
    { title: "Secure live exam delivery", icon: ShieldCheck },
    { title: "Transparent results and ranking", icon: Award },
    { title: "AI after publication only", icon: CheckCircle2 }
  ];

  return (
    <main className="container py-14">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase text-primary">About</p>
        <h1 className="mt-3 text-4xl font-semibold">A modern test portal for disciplined learning operations</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Sankalp Digital Pathshala Test Portal brings exam management, student dashboards, rank
          lists, PDFs, support tickets and AI-assisted review into one responsive platform.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {values.map((value) => (
          <Card key={value.title}>
            <CardContent className="p-5">
              <value.icon className="size-6 text-primary" />
              <p className="mt-4 font-medium">{value.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
