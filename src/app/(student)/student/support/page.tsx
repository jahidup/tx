import { PageHeader } from "@/components/page-header";
import { StudentSupportPage } from "@/features/student/materials-support-profile";

export default function StudentSupportRoutePage() {
  return (
    <div>
      <PageHeader title="Support" description="Create support tickets and track admin replies." />
      <StudentSupportPage />
    </div>
  );
}
