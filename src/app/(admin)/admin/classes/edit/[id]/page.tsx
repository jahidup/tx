import { ResourceForm } from "@/features/admin/resource-form";

export default async function EditClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ResourceForm name="classes" id={id} />;
}
