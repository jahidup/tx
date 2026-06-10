import { PageHeader } from "@/components/page-header";
import { ResultDetail } from "@/features/student/results";

export default async function LeaderboardPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  return (
    <div>
      <PageHeader title="Leaderboard" description="Rank, student name, roll number and marks." />
      <ResultDetail testId={testId} defaultTab="rank-list" />
    </div>
  );
}
