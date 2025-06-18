import Link from "next/link";

interface DocumentLayoutProps {
  children: React.ReactNode;
}

function DocumentsLayout({ children }: DocumentLayoutProps) {
  return (
    <div className="flex flex-col">
      <nav className="w-full bg-lime-200"></nav>
      {children}

      <p>
        Click{" "}
        <Link href="/">
          <span className="text-blue-500 underline mx-1">here</span> to go to
          Home page
        </Link>
      </p>
    </div>
  );
}

export default DocumentsLayout;
