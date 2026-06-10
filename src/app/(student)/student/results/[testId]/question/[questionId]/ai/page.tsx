import { PageHeader } from "@/components/page-header";
import { AiExplanationPage } from "@/features/student/ai-explanation";

export default async function AiPage({
  params
}: {
  params: Promise<{ testId: string; questionId: string }>;
}) {
  const { testId, questionId } = await params;
  return (
    <div>
      <PageHeader title="AI Explanation" description="Dedicated full-page Gemini explanation after result publication." />
      <AiExplanationPage testId={testId} questionId={questionId} />
    </div>
  );
}
