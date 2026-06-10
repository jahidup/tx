import { PageHeader } from "@/components/page-header";
import { ProfilePage } from "@/features/student/materials-support-profile";

export default function ProfileRoutePage() {
  return (
    <div>
      <PageHeader title="Profile" description="Student information configured by the administrator." />
      <ProfilePage />
    </div>
  );
}
