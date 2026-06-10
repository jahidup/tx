import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/lib/env";

export interface AiExplanationInput {
  question: string;
  questionImage?: string;
  studentAnswer?: string;
  correctAnswer?: string;
  subject?: string;
  className?: string;
}

export async function explainWithGemini(input: AiExplanationInput) {
  if (!env.geminiApiKey) {
    return {
      generated: false,
      explanation:
        "Gemini is not configured yet. Add GEMINI_API_KEY in Vercel or .env.local to enable AI explanations after results are published."
    };
  }

  const genAI = new GoogleGenerativeAI(env.geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = [
    "You are Sankalp Digital Pathshala's educational AI assistant.",
    "AI is only available after result publication. Provide student-safe learning guidance.",
    `Class: ${input.className || "Not provided"}`,
    `Subject: ${input.subject || "Not provided"}`,
    `Question: ${input.question}`,
    `Student answer: ${input.studentAnswer || "Not attempted"}`,
    `Correct answer: ${input.correctAnswer || "Not provided"}`,
    "Return sections: Step By Step Solution, Mistake Analysis, Easy Explanation, Hindi Explanation, English Explanation, Hinglish Explanation, Similar Questions."
  ].join("\n");

  const response = await model.generateContent(prompt);
  return {
    generated: true,
    explanation: response.response.text()
  };
}
