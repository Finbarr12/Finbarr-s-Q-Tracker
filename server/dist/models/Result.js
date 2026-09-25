"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
const mongoose_1 = require("mongoose");
const resultSchema = new mongoose_1.Schema({
    quiz: { type: mongoose_1.Schema.Types.ObjectId, ref: "Quiz", required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});
exports.Result = (0, mongoose_1.model)("Result", resultSchema);
