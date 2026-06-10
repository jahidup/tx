import { PageHeader } from "@/components/page-header";
import { StudentDashboard } from "@/features/student/student-dashboard";

export default function StudentPage() {
  return (
    <div>
      <PageHeader title="Student Dashboard" description="Upcoming tests, live tests, latest result, rank and quick learning actions." />
      <StudentDashboard />
    </div>
  );
}
