import Link from "next/link";
import { getQuizzes } from "@/lib/api";

export default async function HomePage() {
  let count = 0;
  try {
    const quizzes = await getQuizzes();
    count = quizzes.length;
  } catch {
    count = 0;
  }

  if (count === 0) {
    return (
      <div className="dashboard-empty">
        <h1>Welcome</h1>
        <p className="page-subtitle">
          You haven&apos;t created any quizzes yet. Start with your first one —
          it only takes a minute.
        </p>
        <Link href="/new" className="btn btn-primary">
          + Create your first quiz
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome back</h1>
      <p className="page-subtitle">
        Pick a quiz from the list on the left, or start a new one.
      </p>
      <Link href="/new" className="btn btn-secondary">
        + Create a new quiz
      </Link>
    </div>
  );
}
