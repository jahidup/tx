import { PageHeader } from "@/components/page-header";
import { ResultsList } from "@/features/student/results";

export default function ResultsPage() {
  return (
    <div>
      <PageHeader title="Results" description="Published test result folders with overview, rank list, review, PDFs and AI explanation links." />
      <ResultsList />
    </div>
  );
}
