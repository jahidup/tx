import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export default function AiSettingsPage() {
  return (
    <div>
      <PageHeader title="AI Settings" description="Gemini controls for post-result question explanation workflows." icon="Brain" />
      <Card>
        <CardHeader>
          <CardTitle>AI Safety Rules</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {[
            "AI is disabled during live tests",
            "AI pages are available only after result publication",
            "Gemini API key is read from GEMINI_API_KEY",
            "Question images can be stored in Cloudinary"
          ].map((rule) => (
            <div key={rule} className="flex items-center gap-3 rounded-md border bg-background p-4">
              <ShieldCheck className="size-5 text-primary" />
              <span className="text-sm font-medium">{rule}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
