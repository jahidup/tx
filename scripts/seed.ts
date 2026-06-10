import bcrypt from "bcryptjs";
import { connectToDatabase } from "../src/lib/db";
import { env } from "../src/lib/env";
import { AdminUser, Question, SdpClass, Student, Test } from "../src/models";

async function main() {
  await connectToDatabase();

  const passwordHash = await bcrypt.hash(env.adminPassword, 12);
  await AdminUser.findOneAndUpdate(
    { adminId: env.adminId },
    {
      $set: {
        adminId: env.adminId,
        name: "Super Admin",
        passwordHash,
        status: "active"
      }
    },
    { upsert: true, new: true }
  );

  const classDoc = await SdpClass.findOneAndUpdate(
    { className: "Class 10 Foundation" },
    {
      $set: {
        className: "Class 10 Foundation",
        description: "Board and scholarship preparation batch"
      }
    },
    { upsert: true, new: true }
  );

  await Student.findOneAndUpdate(
    { rollNumber: "SDP1001" },
    {
      $set: {
        name: "Aarav Sharma",
        rollNumber: "SDP1001",
        dob: "15-08-2010",
        classId: classDoc._id,
        email: "aarav@example.com",
        mobile: "9876543210",
        fatherName: "Ramesh Sharma",
        motherName: "Kavita Sharma",
        status: "active"
      }
    },
    { upsert: true, new: true }
  );

  const questionOne = await Question.findOneAndUpdate(
    { questionText: "If 2x + 5 = 17, what is the value of x?" },
    {
      $set: {
        questionType: "MCQ",
        questionText: "If 2x + 5 = 17, what is the value of x?",
        subject: "Mathematics",
        chapter: "Linear Equations",
        difficulty: "Easy",
        marks: 4,
        options: [{ text: "4" }, { text: "5" }, { text: "6" }, { text: "7" }],
        correctAnswer: "6",
        solutionText: "Subtract 5 from both sides to get 2x = 12, then divide by 2."
      }
    },
    { upsert: true, new: true }
  );

  const questionTwo = await Question.findOneAndUpdate(
    { questionText: "Find the perimeter of a square with side length 9 cm." },
    {
      $set: {
        questionType: "Numerical",
        questionText: "Find the perimeter of a square with side length 9 cm.",
        subject: "Mathematics",
        chapter: "Mensuration",
        difficulty: "Medium",
        marks: 4,
        options: [],
        correctAnswer: "36",
        solutionText: "Perimeter of a square is 4 x side, so 4 x 9 = 36 cm."
      }
    },
    { upsert: true, new: true }
  );

  await Test.findOneAndUpdate(
    { testName: "Mathematics Weekly Test 01" },
    {
      $set: {
        testName: "Mathematics Weekly Test 01",
        description: "Linear equations and mensuration practice",
        classId: classDoc._id,
        subject: "Mathematics",
        duration: 35,
        totalMarks: 8,
        totalQuestions: 2,
        markingScheme: {
          correctMarks: 4,
          wrongMarks: -1,
          notAttemptedMarks: 0
        },
        questionIds: [questionOne._id, questionTwo._id],
        settings: {
          randomQuestions: false,
          randomOptions: false,
          enableRankList: true,
          enableQuestionReview: true,
          enableAIReview: true,
          showStudentAnswers: true,
          showCorrectAnswers: true,
          showFullRanking: true
        },
        status: "live"
      }
    },
    { upsert: true, new: true }
  );

  console.log("Seed complete: admin, class, student, questions and live test are ready.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
