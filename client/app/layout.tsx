import type { Metadata } from "next";
import Link from "next/link";
import { getQuizzes } from "@/lib/api";
import SidebarLink from "@/components/SidebarLink";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quiz Tracker",
  description: "Create quizzes, take them, and track your scores.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let quizzes: Awaited<ReturnType<typeof getQuizzes>> = [];
  let sidebarError = false;

  try {
    quizzes = await getQuizzes();
  } catch {
    sidebarError = true;
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="topbar">
          <Link href="/" className="brand">
            <span className="brand-mark">F</span>
            <span className="brand-name">Finbarr's Q Tracker</span>
          </Link>
          <Link href="/new" className="btn btn-primary">
            + Create quiz
          </Link>
        </header>

        <div className="shell">
          <aside className="sidebar">
            <div className="sidebar-head">
              <span>All quizzes</span>
              <span className="sidebar-count">{quizzes.length}</span>
            </div>

            {sidebarError ? (
              <p className="sidebar-empty">Couldn&apos;t load quizzes.</p>
            ) : quizzes.length === 0 ? (
              <p className="sidebar-empty">
                No quizzes yet — create your first one.
              </p>
            ) : (
              <nav className="sidebar-nav">
                {quizzes.map((q) => (
                  <SidebarLink
                    key={q.id}
                    id={q.id}
                    title={q.title}
                    questionCount={q.questionCount}
                  />
                ))}
              </nav>
            )}
          </aside>

          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
