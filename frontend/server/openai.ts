// Reference: javascript_openai blueprint
import OpenAI from "openai";

// Lazy initialization - only create OpenAI client when needed
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY must be set");
  }
  
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  
  return openaiClient;
}

export async function generateCourseContent(topic: string, grade: string, subject: string, duration: string, notes?: string) {
  const openai = getOpenAIClient();
  
  const prompt = `You are an expert educational curriculum designer. Create a comprehensive course structure for:

Topic: ${topic}
Subject: ${subject}
Grade Level: ${grade}
Duration: ${duration}
${notes ? `Additional Notes: ${notes}` : ""}

Generate a detailed course outline with:
1. Course title and description
2. Learning objectives (at least 8-12 objectives)
3. Weekly lesson breakdown with topics
4. Assessment strategy (homework, quizzes, projects, exams)
5. Recommended resources

Provide the output in JSON format with the following structure:
{
  "title": "string",
  "description": "string",
  "objectives": ["string"],
  "outline": ["string"],
  "totalLessons": number,
  "assessments": [{"type": "string", "title": "string", "weight": number}],
  "resources": ["string"]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are an expert educational curriculum designer specializing in creating comprehensive course structures for Ethiopian schools. Respond with valid JSON only."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 4096,
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}
