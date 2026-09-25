"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createQuiz } from "@/lib/api";
import type { QuestionInput } from "@/lib/types";

function emptyQuestion(): QuestionInput {
  return { text: "", correctAnswer: "" };
}

export default function NewQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionInput[]>([
    emptyQuestion(),
  ]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateQuestion(
    index: number,
    field: keyof QuestionInput,
    value: string,
  ) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q)),
    );
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, emptyQuestion()]);
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Give the quiz a title.");
      return;
    }
    if (questions.some((q) => !q.text.trim() || !q.correctAnswer.trim())) {
      setError("Fill in every question and its correct answer.");
      return;
    }

    setSubmitting(true);
    try {
      await createQuiz(title.trim(), questions);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not create the quiz.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>New quiz</h1>
      <p className="page-subtitle">
        Give it a title, then add as many questions as you need.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            className="input title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Capital Cities"
            autoFocus
          />
        </div>

        {questions.map((q, i) => (
          <div className="question-block" key={i}>
            <div className="question-block-head">
              <span className="question-number">Question {i + 1}</span>
              {questions.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeQuestion(i)}
                >
                  Remove
                </button>
              )}
            </div>
            <div className="field">
              <label htmlFor={`q-${i}`}>Question</label>
              <input
                id={`q-${i}`}
                className="input"
                type="text"
                value={q.text}
                onChange={(e) => updateQuestion(i, "text", e.target.value)}
                placeholder="What's the question?"
              />
            </div>
            <div className="field">
              <label htmlFor={`a-${i}`}>Correct answer</label>
              <input
                id={`a-${i}`}
                className="input"
                type="text"
                value={q.correctAnswer}
                onChange={(e) =>
                  updateQuestion(i, "correctAnswer", e.target.value)
                }
                placeholder="Exact answer to accept"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={addQuestion}
        >
          + Add question
        </button>

        {error && <p className="error-text">{error}</p>}

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Saving…" : "Save quiz"}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => router.push("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
