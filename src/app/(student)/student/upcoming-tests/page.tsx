import { PageHeader } from "@/components/page-header";
import { TestList } from "@/features/student/test-list";

export default function UpcomingTestsPage() {
  return (
    <div>
      <PageHeader title="Upcoming Tests" description="Scheduled tests assigned to your class." />
      <TestList status="scheduled" />
    </div>
  );
}
