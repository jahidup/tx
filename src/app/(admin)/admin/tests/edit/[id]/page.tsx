import { TestWizard } from "@/features/admin/test-wizard";

export default async function EditTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TestWizard id={id} />;
}
