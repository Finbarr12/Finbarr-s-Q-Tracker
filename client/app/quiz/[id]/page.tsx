"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { getQuiz, submitQuiz } from "@/lib/api";
import type { QuizDetail, SubmitResult } from "@/lib/types";

export default function TakeQuizPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getQuiz(params.id)
      .then(setQuiz)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Could not load quiz."),
      )
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!quiz) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitQuiz(quiz.id, answers);
      setResult(res);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not submit answers.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function retake() {
    setAnswers({});
    setResult(null);
    setError(null);
  }

  if (loading) return <p className="loading-text">Loading quiz…</p>;
  if (error && !quiz) return <p className="error-text">{error}</p>;
  if (!quiz) return null;

  const answeredCount = quiz.questions.filter((q) =>
    (answers[q.id] || "").trim(),
  ).length;
  const allAnswered = answeredCount === quiz.questions.length;

  return (
    <div>
      <h1>{quiz.title}</h1>

      {!result && (
        <p className="progress-text">
          {answeredCount} of {quiz.questions.length} answered
        </p>
      )}

      {result && (
        <div className="score-box">
          <span className="score-number">
            {result.score}/{result.total}
          </span>
          <span className="score-caption">answered correctly</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {quiz.questions.map((q, i) => {
          const b = result?.breakdown[i];
          return (
            <div className="take-question" key={q.id}>
              <p className="take-question-text">
                {i + 1}. {q.text}
              </p>
              {result && b ? (
                <div
                  className={`answer-reveal ${
                    b.correct ? "reveal-correct" : "reveal-incorrect"
                  }`}
                >
                  <span className="reveal-mark">{b.correct ? "✓" : "✕"}</span>
                  <div>
                    <p className="reveal-given">
                      Your answer: {b.given || "(left blank)"}
                    </p>
                    {!b.correct && (
                      <p className="reveal-correct-text">
                        Correct answer: {b.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <input
                  className="input"
                  type="text"
                  value={answers[q.id] || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                  placeholder="Type your answer"
                />
              )}
            </div>
          );
        })}

        {error && <p className="error-text">{error}</p>}

        {!result ? (
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || !allAnswered}
          >
            {submitting ? "Submitting…" : "Submit answers"}
          </button>
        ) : (
          <div className="form-actions">
            <button type="button" className="btn btn-primary" onClick={retake}>
              Retake this quiz
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => router.push("/")}
            >
              Back to quizzes
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
