import { PageHeader } from "@/components/page-header";
import { TestList } from "@/features/student/test-list";

export default function LiveTestsPage() {
  return (
    <div>
      <PageHeader title="Live Tests" description="Tests currently accepting submissions. AI is disabled during live tests." />
      <TestList status="live" />
    </div>
  );
}
