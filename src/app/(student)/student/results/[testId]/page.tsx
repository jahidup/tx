import { PageHeader } from "@/components/page-header";
import { ResultDetail } from "@/features/student/results";

export default async function StudentResultDetailPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  return (
    <div>
      <PageHeader title="Result Folder" description="Overview, rank list, question review, answer key, solution PDF and AI review tabs." />
      <ResultDetail testId={testId} />
    </div>
  );
}
