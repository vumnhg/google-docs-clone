"use client";
import Link from "next/link";

function page() {
  return (
    <div className="flex items-center justify-center h-screen">
      Click{"  "}
      <Link href={`documents/123`}>
        <span className="text-blue-500 underline mx-1">here</span>
      </Link>
      {"  "}
      to go to Document 123 page
    </div>
  );
}

export default page;
