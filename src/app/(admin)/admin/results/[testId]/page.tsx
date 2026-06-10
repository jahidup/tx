import { ResultsAdminDetail } from "@/features/admin/results-admin-detail";

export default async function ResultsDetailPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  return <ResultsAdminDetail testId={testId} />;
}
