import { Schema, model, Types } from "mongoose";

export interface IQuestion {
  _id: Types.ObjectId;
  text: string;
  correctAnswer: string;
}

export interface IQuiz {
  title: string;
  questions: IQuestion[];
  createdAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    text: { type: String, required: true, trim: true },
    correctAnswer: { type: String, required: true, trim: true },
  },
  { _id: true }
);

const quizSchema = new Schema<IQuiz>({
  title: { type: String, required: true, trim: true },
  questions: {
    type: [questionSchema],
    validate: {
      validator: (qs: IQuestion[]) => qs.length > 0,
      message: "A quiz needs at least one question.",
    },
  },
  createdAt: { type: Date, default: Date.now },
});

export const Quiz = model<IQuiz>("Quiz", quizSchema);
