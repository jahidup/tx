import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export default function EmailsPage() {
  return (
    <div>
      <PageHeader title="Emails" description="Gmail SMTP notifications for published results and student updates." icon="Mail" />
      <Card>
        <CardHeader>
          <CardTitle>Gmail SMTP Status</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {["EMAIL_USER", "EMAIL_PASS", "Result PDF attachments"].map((item) => (
            <div key={item} className="rounded-md border bg-background p-4">
              <p className="font-medium">{item}</p>
              <p className="mt-1 text-sm text-muted-foreground">Configure this in Vercel environment variables.</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
