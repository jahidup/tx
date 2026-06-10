import type { MarkingScheme, ScoreSummary, StudentAnswer } from "@/types/platform";

type QuestionLike = {
  _id: string;
  correctAnswer: string;
  marks?: number;
};

function normalizeAnswer(value?: string | null) {
  return String(value || "").trim().toLowerCase();
}

export function scoreAttempt(
  questions: QuestionLike[],
  answers: StudentAnswer[],
  markingScheme: MarkingScheme
): ScoreSummary & { gradedAnswers: Array<StudentAnswer & { marksAwarded: number; isCorrect: boolean }> } {
  const answerMap = new Map(answers.map((answer) => [String(answer.questionId), answer]));
  let score = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let notAttemptedCount = 0;

  const gradedAnswers = questions.map((question) => {
    const answer = answerMap.get(String(question._id));
    const attempted = Boolean(normalizeAnswer(answer?.answer));
    const isCorrect = attempted && normalizeAnswer(answer?.answer) === normalizeAnswer(question.correctAnswer);
    let marksAwarded = markingScheme.notAttemptedMarks;

    if (!attempted) {
      notAttemptedCount += 1;
    } else if (isCorrect) {
      correctCount += 1;
      marksAwarded = markingScheme.correctMarks;
    } else {
      wrongCount += 1;
      marksAwarded = markingScheme.wrongMarks;
    }

    score += marksAwarded;

    return {
      questionId: String(question._id),
      answer: answer?.answer || "",
      markedForReview: answer?.markedForReview || false,
      timeSpent: answer?.timeSpent || 0,
      marksAwarded,
      isCorrect
    };
  });

  const totalMarks =
    questions.length * Math.max(markingScheme.correctMarks, ...questions.map((question) => question.marks || 0));
  const percentage = totalMarks > 0 ? Math.max(0, (score / totalMarks) * 100) : 0;

  return {
    score,
    percentage: Number(percentage.toFixed(2)),
    correctCount,
    wrongCount,
    notAttemptedCount,
    totalMarks,
    gradedAnswers
  };
}

export function calculateRanks<T extends { score: number; percentage?: number }>(rows: T[]) {
  const sorted = [...rows].sort((a, b) => b.score - a.score);
  return sorted.map((row, index) => ({
    ...row,
    rank: index + 1,
    percentile: Number((((sorted.length - index) / sorted.length) * 100).toFixed(2))
  }));
}
