"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarLink({
  id,
  title,
  questionCount,
}: {
  id: string;
  title: string;
  questionCount: number;
}) {
  const pathname = usePathname();
  const isActive = pathname === `/quiz/${id}`;

  return (
    <Link
      href={`/quiz/${id}`}
      className={`sidebar-link${isActive ? " active" : ""}`}
    >
      <span className="sidebar-link-title">{title}</span>
      <span className="sidebar-link-meta">{questionCount}</span>
    </Link>
  );
}
