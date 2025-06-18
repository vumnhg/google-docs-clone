import Link from "next/link";
import React from "react";

function DocumentPage() {
  const pageId = 123;
  return (
    <div>
      <p>DocumentPages</p>
      <p>
        Click{" "}
        <Link href={`/documents/${pageId}`}>
          <span className="text-blue-500 underline mx-1">here</span> to do to
          page {`${pageId}`}
        </Link>
      </p>
    </div>
  );
}

export default DocumentPage;
