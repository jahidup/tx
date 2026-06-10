import { ResourceForm } from "@/features/admin/resource-form";

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ResourceForm name="students" id={id} />;
}
