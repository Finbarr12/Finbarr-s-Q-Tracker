"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const mongoose_1 = require("mongoose");
const questionSchema = new mongoose_1.Schema({
    text: { type: String, required: true, trim: true },
    correctAnswer: { type: String, required: true, trim: true },
}, { _id: true });
const quizSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    questions: {
        type: [questionSchema],
        validate: {
            validator: (qs) => qs.length > 0,
            message: "A quiz needs at least one question.",
        },
    },
    createdAt: { type: Date, default: Date.now },
});
exports.Quiz = (0, mongoose_1.model)("Quiz", quizSchema);
