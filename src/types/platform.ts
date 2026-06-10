export type UserRole = "admin" | "student";

export type TestStatus = "draft" | "scheduled" | "live" | "completed" | "published";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type QuestionType = "MCQ" | "Numerical" | "Fill In The Blank";

export type TicketStatus = "open" | "in-progress" | "closed";

export type ResourceName =
  | "classes"
  | "students"
  | "questions"
  | "tests"
  | "results"
  | "materials"
  | "tickets"
  | "notifications";

export interface SessionPayload {
  id: string;
  role: UserRole;
  name?: string;
  rollNumber?: string;
  adminId?: string;
}

export interface MarkingScheme {
  correctMarks: number;
  wrongMarks: number;
  notAttemptedMarks: number;
}

export interface TestSettings {
  randomQuestions: boolean;
  randomOptions: boolean;
  enableRankList: boolean;
  enableQuestionReview: boolean;
  enableAIReview: boolean;
  showStudentAnswers: boolean;
  showCorrectAnswers: boolean;
  showFullRanking: boolean;
}

export interface StudentAnswer {
  questionId: string;
  answer: string;
  markedForReview?: boolean;
  timeSpent?: number;
}

export interface ScoreSummary {
  score: number;
  percentage: number;
  correctCount: number;
  wrongCount: number;
  notAttemptedCount: number;
  totalMarks: number;
}

export interface ApiError {
  error: string;
  message: string;
}
