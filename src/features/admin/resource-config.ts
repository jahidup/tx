"use client";

import type { IconName } from "@/components/page-header";
import type { ResourceName } from "@/types/platform";

export type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "textarea" | "select" | "datetime-local";
  options?: Array<{ label: string; value: string }>;
  required?: boolean;
  placeholder?: string;
};

export type ResourceConfig = {
  resource: ResourceName | "tests";
  title: string;
  description: string;
  createLabel: string;
  icon: IconName;
  columns: Array<{ key: string; label: string }>;
  fields: FieldConfig[];
};

export const resourceConfigs: Record<string, ResourceConfig> = {
  classes: {
    resource: "classes",
    title: "Classes",
    description: "Create, edit, search and maintain class cohorts.",
    createLabel: "Create Class",
    icon: "GraduationCap",
    columns: [
      { key: "className", label: "Class Name" },
      { key: "description", label: "Description" },
      { key: "createdAt", label: "Created" }
    ],
    fields: [
      { name: "className", label: "Class Name", required: true },
      { name: "description", label: "Description", type: "textarea" }
    ]
  },
  students: {
    resource: "students",
    title: "Students",
    description: "Admin-created student accounts with roll number and DOB login.",
    createLabel: "Add Student",
    icon: "Users",
    columns: [
      { key: "name", label: "Name" },
      { key: "rollNumber", label: "Roll Number" },
      { key: "email", label: "Email" },
      { key: "status", label: "Status" }
    ],
    fields: [
      { name: "name", label: "Student Name", required: true },
      { name: "rollNumber", label: "Roll Number", required: true, placeholder: "SDP1001" },
      { name: "dob", label: "Date Of Birth", required: true, placeholder: "DD-MM-YYYY" },
      { name: "email", label: "Email", type: "email" },
      { name: "mobile", label: "Mobile" },
      { name: "fatherName", label: "Father Name" },
      { name: "motherName", label: "Mother Name" },
      { name: "classId", label: "Class ID" },
      { name: "profilePhoto", label: "Profile Photo URL" },
      { name: "address", label: "Address", type: "textarea" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
          { label: "Blocked", value: "blocked" }
        ]
      }
    ]
  },
  questions: {
    resource: "questions",
    title: "Question Bank",
    description: "MCQ, numerical, fill-in-the-blank and image-supported questions.",
    createLabel: "Add Question",
    icon: "FileQuestion",
    columns: [
      { key: "questionText", label: "Question" },
      { key: "subject", label: "Subject" },
      { key: "difficulty", label: "Difficulty" },
      { key: "marks", label: "Marks" }
    ],
    fields: [
      {
        name: "questionType",
        label: "Question Type",
        type: "select",
        options: [
          { label: "MCQ", value: "MCQ" },
          { label: "Numerical", value: "Numerical" },
          { label: "Fill In The Blank", value: "Fill In The Blank" }
        ],
        required: true
      },
      { name: "questionText", label: "Question Text", type: "textarea", required: true },
      { name: "questionImage", label: "Question Image URL" },
      { name: "subject", label: "Subject", required: true },
      { name: "chapter", label: "Chapter" },
      {
        name: "difficulty",
        label: "Difficulty",
        type: "select",
        options: [
          { label: "Easy", value: "Easy" },
          { label: "Medium", value: "Medium" },
          { label: "Hard", value: "Hard" }
        ]
      },
      { name: "marks", label: "Marks", type: "number" },
      { name: "options", label: "Options", type: "textarea", placeholder: "One option per line" },
      { name: "correctAnswer", label: "Correct Answer", required: true },
      { name: "solutionText", label: "Solution Text", type: "textarea" },
      { name: "solutionImage", label: "Solution Image URL" }
    ]
  },
  tests: {
    resource: "tests",
    title: "Tests",
    description: "Create tests with a multi-step wizard, schedules, settings and question selection.",
    createLabel: "Create Test",
    icon: "BookOpen",
    columns: [
      { key: "testName", label: "Test Name" },
      { key: "subject", label: "Subject" },
      { key: "duration", label: "Duration" },
      { key: "status", label: "Status" }
    ],
    fields: []
  },
  results: {
    resource: "results",
    title: "Results",
    description: "Publish results, control answer visibility and trigger notifications.",
    createLabel: "View Results",
    icon: "Medal",
    columns: [
      { key: "testId", label: "Test" },
      { key: "score", label: "Score" },
      { key: "rank", label: "Rank" },
      { key: "published", label: "Published" }
    ],
    fields: []
  },
  materials: {
    resource: "materials",
    title: "Study Materials",
    description: "Upload and manage PDF study material for student download and preview.",
    createLabel: "Upload Material",
    icon: "FolderOpen",
    columns: [
      { key: "title", label: "Title" },
      { key: "subject", label: "Subject" },
      { key: "pdfUrl", label: "PDF URL" },
      { key: "createdAt", label: "Created" }
    ],
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "classId", label: "Class ID" },
      { name: "subject", label: "Subject" },
      { name: "pdfUrl", label: "PDF URL", required: true }
    ]
  },
  support: {
    resource: "tickets",
    title: "Support Tickets",
    description: "Reply to student support requests and close resolved tickets.",
    createLabel: "Create Ticket",
    icon: "LifeBuoy",
    columns: [
      { key: "title", label: "Title" },
      { key: "message", label: "Message" },
      { key: "status", label: "Status" },
      { key: "createdAt", label: "Created" }
    ],
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "message", label: "Message", type: "textarea", required: true },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { label: "Open", value: "open" },
          { label: "In Progress", value: "in-progress" },
          { label: "Closed", value: "closed" }
        ]
      }
    ]
  }
};
