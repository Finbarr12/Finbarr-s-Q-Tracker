import type {
  QuizSummary,
  QuizDetail,
  QuestionInput,
  SubmitResult,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function getQuizzes(): Promise<QuizSummary[]> {
  const res = await fetch(`${API_URL}/api/quizzes`, { cache: "no-store" });
  return handle<QuizSummary[]>(res);
}

export async function getQuiz(id: string): Promise<QuizDetail> {
  const res = await fetch(`${API_URL}/api/quizzes/${id}`, {
    cache: "no-store",
  });
  return handle<QuizDetail>(res);
}

export async function createQuiz(
  title: string,
  questions: QuestionInput[]
): Promise<{ _id: string }> {
  const res = await fetch(`${API_URL}/api/quizzes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, questions }),
  });
  return handle<{ _id: string }>(res);
}

export async function submitQuiz(
  id: string,
  answers: Record<string, string>
): Promise<SubmitResult> {
  const res = await fetch(`${API_URL}/api/quizzes/${id}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  return handle<SubmitResult>(res);
}
