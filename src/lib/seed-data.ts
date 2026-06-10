export const demoClasses = [
  {
    _id: "class-10",
    className: "Class 10 Foundation",
    description: "Board and scholarship preparation batch"
  },
  {
    _id: "class-8",
    className: "Class 8 Olympiad",
    description: "Maths and science skill-building cohort"
  }
];

export const demoStudents = [
  {
    _id: "demo-student",
    name: "Aarav Sharma",
    rollNumber: "SDP1001",
    dob: "15-08-2010",
    classId: "class-10",
    email: "aarav@example.com",
    mobile: "9876543210",
    fatherName: "Ramesh Sharma",
    motherName: "Kavita Sharma",
    status: "active"
  },
  {
    _id: "student-2",
    name: "Ananya Verma",
    rollNumber: "SDP1002",
    dob: "22-03-2011",
    classId: "class-10",
    email: "ananya@example.com",
    mobile: "9876543211",
    fatherName: "Nitin Verma",
    motherName: "Pooja Verma",
    status: "active"
  }
];

export const demoQuestions = [
  {
    _id: "q-1",
    questionType: "MCQ",
    questionText: "If 2x + 5 = 17, what is the value of x?",
    subject: "Mathematics",
    chapter: "Linear Equations",
    difficulty: "Easy",
    marks: 4,
    options: [{ text: "4" }, { text: "5" }, { text: "6" }, { text: "7" }],
    correctAnswer: "6",
    solutionText: "Subtract 5 from both sides to get 2x = 12, then divide by 2."
  },
  {
    _id: "q-2",
    questionType: "MCQ",
    questionText: "Which organelle is known as the powerhouse of the cell?",
    subject: "Science",
    chapter: "Cell Biology",
    difficulty: "Easy",
    marks: 4,
    options: [{ text: "Nucleus" }, { text: "Mitochondria" }, { text: "Ribosome" }, { text: "Golgi body" }],
    correctAnswer: "Mitochondria",
    solutionText: "Mitochondria release energy through cellular respiration."
  },
  {
    _id: "q-3",
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
];

export const demoTests = [
  {
    _id: "test-1",
    testName: "Mathematics Weekly Test 01",
    description: "Linear equations and mensuration practice",
    classId: "class-10",
    subject: "Mathematics",
    duration: 35,
    startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    totalMarks: 12,
    totalQuestions: 3,
    markingScheme: {
      correctMarks: 4,
      wrongMarks: -1,
      notAttemptedMarks: 0
    },
    questionIds: ["q-1", "q-2", "q-3"],
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
  },
  {
    _id: "test-2",
    testName: "Science Weekly Test 02",
    description: "Cell biology result published for review",
    classId: "class-10",
    subject: "Science",
    duration: 25,
    totalMarks: 4,
    totalQuestions: 1,
    markingScheme: {
      correctMarks: 4,
      wrongMarks: -1,
      notAttemptedMarks: 0
    },
    questionIds: ["q-2"],
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
    status: "published"
  }
];

export const demoResults = [
  {
    _id: "result-1",
    studentId: "demo-student",
    testId: "test-2",
    score: 4,
    rank: 1,
    percentile: 98,
    percentage: 100,
    correctCount: 1,
    wrongCount: 0,
    notAttemptedCount: 0,
    published: true,
    createdAt: new Date().toISOString()
  }
];

export const demoMaterials = [
  {
    _id: "material-1",
    title: "Class 10 Maths Formula Sheet",
    description: "Quick revision PDF for algebra and mensuration.",
    classId: "class-10",
    subject: "Mathematics",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    createdAt: new Date().toISOString()
  }
];

export const demoTickets = [
  {
    _id: "ticket-1",
    studentId: "demo-student",
    title: "Need access to solution PDF",
    message: "Please enable the solution PDF for Science Weekly Test 02.",
    status: "open",
    createdAt: new Date().toISOString()
  }
];

export const demoNotifications = [
  {
    _id: "notification-1",
    title: "New live test",
    message: "Mathematics Weekly Test 01 is live now.",
    type: "New Test",
    read: false,
    createdAt: new Date().toISOString()
  }
];
