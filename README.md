# Finbarr'sQ Tracker

A small app for creating quizzes, taking them, and tracking scores.

Open `http://localhost:3000`.

## API

| Method | Route                     | Description                                  |
| ------ | ------------------------- | -------------------------------------------- |
| POST   | `/api/quizzes`            | Create a quiz (`{ title, questions[] }`)     |
| GET    | `/api/quizzes`            | List all quizzes (summary: id, title, count) |
| GET    | `/api/quizzes/:id`        | Get one quiz to take (answers withheld)      |
| POST   | `/api/quizzes/:id/submit` | Submit answers, get graded (`{ answers }`)   |

## Decisions & trade-offs

- **Scoring happens server-side.** The take-quiz endpoint never sends correct
  answers to the client — the client only gets question text. The server grades
  submissions and stores a `Result` document, so the score can't be spoofed from
  the browser.
- **Answer matching** is case-insensitive and trims whitespace, since this is a
  short-answer quiz format rather than multiple choice. It does not do fuzzy/typo
  matching — an exact (normalized) match is required.
- **No auth.** The assignment didn't ask for user accounts, so quizzes and
  results aren't tied to a user. Anyone can create or take any quiz.
- **No separate results/history page.** Scores are stored in MongoDB (a
  `Result` per submission) but there's currently no page to browse past
  results — only the score shown right after submitting. This was left out to
  stay within scope; it would be a small addition (`GET /api/results?quizId=`)
  if wanted.
- **Styling is plain CSS**, not a component library, to keep the two layers
  simple and avoid pulling in extra tooling for a small app.
- **Validation is manual** (basic required-field checks) rather than a schema
  validation library, since the input shape is small and simple.
