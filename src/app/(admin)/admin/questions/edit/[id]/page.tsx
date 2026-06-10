import { ResourceForm } from "@/features/admin/resource-form";

export default async function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ResourceForm name="questions" id={id} />;
}
