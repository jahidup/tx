import { PageHeader } from "@/components/page-header";
import { AdminDashboard } from "@/features/admin/admin-dashboard";

export default function AdminPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Live operational analytics for students, classes, tests, results, recent activities, logins and email status."
      />
      <AdminDashboard />
    </div>
  );
}
