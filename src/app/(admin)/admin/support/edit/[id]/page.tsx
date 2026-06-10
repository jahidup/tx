import { ResourceForm } from "@/features/admin/resource-form";

export default async function EditSupportTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ResourceForm name="support" id={id} />;
}
