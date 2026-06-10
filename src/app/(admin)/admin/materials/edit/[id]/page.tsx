import { ResourceForm } from "@/features/admin/resource-form";

export default async function EditMaterialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ResourceForm name="materials" id={id} />;
}
