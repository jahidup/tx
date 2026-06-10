import { PageHeader } from "@/components/page-header";
import { ExamEngine } from "@/features/student/exam-engine";

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <PageHeader title="Live Exam Engine" description="Autosave, countdown timer, question palette, review marks and auto-submit are enabled." />
      <ExamEngine testId={id} />
    </div>
  );
}
