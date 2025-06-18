import Link from "next/link";
import Editor from "@/app/documents/[documentId]/editor";
import { Toolbar } from "@/app/documents/[documentId]/toolbar";
interface DocumentIdPageProps {
  params: Promise<{ documentId: string }>;
}

export default async function DocumentIdPage({ params }: DocumentIdPageProps) {
  const { documentId } = await params;

  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      <p>{`document page: ${documentId}`}</p>
      <Toolbar />
      <Editor />
      <p>
        Click{" "}
        <Link href="/documents">
          <span className="text-blue-500 underline mx-1">here</span> to go to
          Documents page
        </Link>
      </p>
    </div>
  );
}
