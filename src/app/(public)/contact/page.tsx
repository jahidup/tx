import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/features/public/contact-form";

export default function ContactPage() {
  return (
    <main className="container grid gap-8 py-14 lg:grid-cols-[0.85fr_1.15fr]">
      <div>
        <p className="text-sm font-semibold uppercase text-primary">Contact</p>
        <h1 className="mt-3 text-4xl font-semibold">Talk to the portal team</h1>
        <p className="mt-4 text-muted-foreground">
          Use this inquiry page for institute onboarding, student support, result publication or
          deployment configuration.
        </p>
        <div className="mt-8 grid gap-3">
          {[
            ["Email", "Configure EMAIL_USER for production replies", Mail],
            ["Phone", "Add institute phone number in content settings", Phone],
            ["Location", "Sankalp Digital Pathshala", MapPin]
          ].map(([label, value, Icon]) => (
            <div key={String(label)} className="flex items-center gap-3 rounded-lg border bg-card p-4">
              <Icon className="size-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{String(label)}</p>
                <p className="text-sm text-muted-foreground">{String(value)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Send inquiry</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactForm />
        </CardContent>
      </Card>
    </main>
  );
}
