import { PageHeader } from "@/components/page-header";
import { TestList } from "@/features/student/test-list";

export default function PreviousTestsPage() {
  return (
    <div>
      <PageHeader title="Previous Tests" description="Published tests appear as folders containing result, leaderboard, review, PDFs and AI review." />
      <TestList status="published" folderMode />
    </div>
  );
}
