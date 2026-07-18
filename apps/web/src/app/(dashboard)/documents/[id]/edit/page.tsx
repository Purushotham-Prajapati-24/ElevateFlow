import { getCurrentUser } from "@/lib/session";
import { db, documents } from "@elevateflow/db";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { EditForm } from "./edit-form";

interface EditDocumentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditDocumentPage({
  params,
}: EditDocumentPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const [doc] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, id))
    .limit(1);

  if (!doc) {
    notFound();
  }

  // Ownership & state check
  if (doc.authorId !== user.id || (doc.status !== "draft" && doc.status !== "rejected")) {
    redirect(`/documents/${id}` as any);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <EditForm initialDoc={{ ...doc, status: doc.status as any }} />
    </div>
  );
}
