import { Database, KeyRound, Settings, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="System Settings" description="Deployment, security and service configuration checklist." icon="Settings" />
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["MongoDB Atlas", "MONGODB_URI", Database],
          ["JWT Secret", "JWT_SECRET", KeyRound],
          ["Secure Cookies", "HTTP-only role cookies", ShieldCheck],
          ["Cloudinary Storage", "CLOUDINARY_* variables", Settings]
        ].map(([title, detail, Icon]) => (
          <Card key={String(title)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Icon className="size-5 text-primary" />
                {String(title)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{String(detail)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
