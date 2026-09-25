import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import quizRoutes from "./routes/quizzes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/quizzes", quizRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found." });
});

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}

connectDB(MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
