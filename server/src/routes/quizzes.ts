import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import { Quiz } from "../models/Quiz";
import { Result } from "../models/Result";

const router = Router();

interface QuestionInput {
  text: string;
  correctAnswer: string;
}

// Create a quiz
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, questions } = req.body as {
      title?: string;
      questions?: QuestionInput[];
    };

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required." });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one question is required." });
    }

    for (const q of questions) {
      if (!q.text?.trim() || !q.correctAnswer?.trim()) {
        return res
          .status(400)
          .json({ error: "Each question needs text and a correct answer." });
      }
    }

    const quiz = await Quiz.create({
      title: title.trim(),
      questions,
    });

    res.status(201).json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create quiz." });
  }
});

// List all quizzes (summary only, no answers)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });

    const summaries = quizzes.map((q) => ({
      id: q._id,
      title: q.title,
      questionCount: q.questions.length,
      createdAt: q.createdAt,
    }));

    res.json(summaries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch quizzes." });
  }
});

// Get one quiz to take (correct answers stripped out on purpose)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid quiz id." });
    }

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found." });
    }

    res.json({
      id: quiz._id,
      title: quiz.title,
      questions: quiz.questions.map((q) => ({
        id: q._id,
        text: q.text,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch quiz." });
  }
});

// Submit answers — server grades it and stores the result
router.post("/:id/submit", async (req: Request, res: Response) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid quiz id." });
    }

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found." });
    }

    const { answers } = req.body as {
      answers?: Record<string, string>;
    };

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "Answers are required." });
    }

    let score = 0;

    const breakdown = quiz.questions.map((q) => {
      // Get the answer submitted by the user
      const given = (answers[String(q._id)] || "").trim();

      // Get the correct answer stored in MongoDB
      const correctAnswer = q.correctAnswer.trim();

      // Compare answers without caring about uppercase/lowercase
      const isCorrect = given.toLowerCase() === correctAnswer.toLowerCase();

      if (isCorrect) {
        score += 1;
      }

      return {
        questionId: String(q._id),
        given: given,
        correct: isCorrect,
        correctAnswer: correctAnswer,
      };
    });

    const total = quiz.questions.length;

    await Result.create({
      quiz: quiz._id,
      score,
      total,
    });

    res.json({
      score,
      total,
      breakdown,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not submit quiz." });
  }
});

export default router;
