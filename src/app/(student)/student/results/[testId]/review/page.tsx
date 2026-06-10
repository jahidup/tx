import { PageHeader } from "@/components/page-header";
import { ResultDetail } from "@/features/student/results";

export default async function QuestionReviewPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  return (
    <div>
      <PageHeader title="Question Review" description="Question, image, student answer, correct answer, marks awarded, solution and AI action." />
      <ResultDetail testId={testId} defaultTab="question-review" />
    </div>
  );
}
