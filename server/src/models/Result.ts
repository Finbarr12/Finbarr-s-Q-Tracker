import { Schema, model, Types } from "mongoose";

export interface IResult {
  quiz: Types.ObjectId;
  score: number;
  total: number;
  createdAt: Date;
}

const resultSchema = new Schema<IResult>({
  quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Result = model<IResult>("Result", resultSchema);
