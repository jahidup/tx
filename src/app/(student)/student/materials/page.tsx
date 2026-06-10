import { PageHeader } from "@/components/page-header";
import { MaterialsPage } from "@/features/student/materials-support-profile";

export default function MaterialsRoutePage() {
  return (
    <div>
      <PageHeader title="Study Materials" description="Download and preview PDFs uploaded by administrators." />
      <MaterialsPage />
    </div>
  );
}
