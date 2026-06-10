import mongoose, { Schema } from "mongoose";

const timestamps = { timestamps: true };
type AnyModel = any;

const AdminUserSchema = new Schema(
  {
    adminId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, default: "Super Admin" },
    passwordHash: { type: String, required: true },
    lastLoginAt: Date,
    status: { type: String, enum: ["active", "disabled"], default: "active" }
  },
  timestamps
);

const ClassSchema = new Schema(
  {
    className: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: "" }
  },
  timestamps
);

const StudentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    profilePhoto: String,
    mobile: String,
    email: { type: String, lowercase: true, trim: true },
    fatherName: String,
    motherName: String,
    rollNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    dob: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: "SdpClass" },
    address: String,
    status: { type: String, enum: ["active", "inactive", "blocked"], default: "active" },
    lastLoginAt: Date
  },
  timestamps
);

const QuestionSchema = new Schema(
  {
    questionType: { type: String, enum: ["MCQ", "Numerical", "Fill In The Blank"], required: true },
    questionText: { type: String, required: true },
    questionImage: String,
    subject: { type: String, required: true, index: true },
    chapter: String,
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    marks: { type: Number, default: 4 },
    options: [{ text: String, image: String }],
    correctAnswer: { type: String, required: true },
    solutionText: String,
    solutionImage: String,
    createdBy: { type: String, default: "admin" }
  },
  timestamps
);

const TestSchema = new Schema(
  {
    testName: { type: String, required: true, index: true },
    description: String,
    classId: { type: Schema.Types.ObjectId, ref: "SdpClass" },
    subject: { type: String, required: true },
    duration: { type: Number, required: true },
    startTime: Date,
    endTime: Date,
    totalMarks: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    markingScheme: {
      correctMarks: { type: Number, default: 4 },
      wrongMarks: { type: Number, default: -1 },
      notAttemptedMarks: { type: Number, default: 0 }
    },
    questionIds: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    settings: {
      randomQuestions: { type: Boolean, default: false },
      randomOptions: { type: Boolean, default: false },
      enableRankList: { type: Boolean, default: true },
      enableQuestionReview: { type: Boolean, default: true },
      enableAIReview: { type: Boolean, default: false },
      showStudentAnswers: { type: Boolean, default: true },
      showCorrectAnswers: { type: Boolean, default: true },
      showFullRanking: { type: Boolean, default: true }
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "live", "completed", "published"],
      default: "draft",
      index: true
    },
    answerKeyPdfUrl: String,
    solutionPdfUrl: String,
    createdBy: { type: String, default: "admin" }
  },
  timestamps
);

const TestAttemptSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    testId: { type: Schema.Types.ObjectId, ref: "Test", required: true, index: true },
    answers: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: "Question" },
        answer: String,
        markedForReview: Boolean,
        timeSpent: Number,
        marksAwarded: Number,
        isCorrect: Boolean
      }
    ],
    score: Number,
    correctCount: Number,
    wrongCount: Number,
    notAttemptedCount: Number,
    timeSpent: Number,
    submittedAt: Date
  },
  timestamps
);

TestAttemptSchema.index({ studentId: 1, testId: 1 }, { unique: true });

const ResultSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    testId: { type: Schema.Types.ObjectId, ref: "Test", required: true, index: true },
    score: Number,
    rank: Number,
    percentile: Number,
    percentage: Number,
    correctCount: Number,
    wrongCount: Number,
    notAttemptedCount: Number,
    published: { type: Boolean, default: false, index: true },
    resultPdfUrl: String,
    performanceSummary: String
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ResultSchema.index({ studentId: 1, testId: 1 }, { unique: true });

const MaterialSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    classId: { type: Schema.Types.ObjectId, ref: "SdpClass" },
    subject: String,
    pdfUrl: { type: String, required: true }
  },
  timestamps
);

const TicketReplySchema = new Schema(
  {
    authorRole: { type: String, enum: ["admin", "student"], required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const TicketSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["open", "in-progress", "closed"], default: "open" },
    replies: [TicketReplySchema]
  },
  timestamps
);

const NotificationSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "Student" },
    type: {
      type: String,
      enum: ["New Test", "Result Published", "New Study Material", "Announcement"],
      default: "Announcement"
    },
    read: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const ActivitySchema = new Schema(
  {
    actor: String,
    action: String,
    entity: String,
    metadata: Schema.Types.Mixed
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AdminUser =
  (mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema, "adminUsers")) as AnyModel;
export const SdpClass =
  (mongoose.models.SdpClass || mongoose.model("SdpClass", ClassSchema, "classes")) as AnyModel;
export const Student = (mongoose.models.Student || mongoose.model("Student", StudentSchema, "students")) as AnyModel;
export const Question = (mongoose.models.Question || mongoose.model("Question", QuestionSchema, "questions")) as AnyModel;
export const Test = (mongoose.models.Test || mongoose.model("Test", TestSchema, "tests")) as AnyModel;
export const TestAttempt =
  (mongoose.models.TestAttempt || mongoose.model("TestAttempt", TestAttemptSchema, "testAttempts")) as AnyModel;
export const Result = (mongoose.models.Result || mongoose.model("Result", ResultSchema, "results")) as AnyModel;
export const Material = (mongoose.models.Material || mongoose.model("Material", MaterialSchema, "materials")) as AnyModel;
export const Ticket = (mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema, "tickets")) as AnyModel;
export const Notification =
  (mongoose.models.Notification ||
    mongoose.model("Notification", NotificationSchema, "notifications")) as AnyModel;
export const Activity = (mongoose.models.Activity || mongoose.model("Activity", ActivitySchema, "activities")) as AnyModel;

export const resourceModels = {
  classes: SdpClass,
  students: Student,
  questions: Question,
  tests: Test,
  results: Result,
  materials: Material,
  tickets: Ticket,
  notifications: Notification
};
