import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface MentionAnalysis {
  sentiment: "positive" | "negative" | "neutral";
  summary: string;
  keywords: string[];
  urgency: "low" | "medium" | "high";
}

export async function analyzeMention(
  content: string,
  brandName: string
): Promise<MentionAnalysis> {
  const prompt = `Analyze the following mention about "${brandName}" and provide:
1. Sentiment (positive, negative, or neutral)
2. A brief summary (max 100 characters)
3. Key topics/keywords mentioned (max 5)
4. Urgency level (low, medium, high)

Mention content:
"""
${content}
"""

Respond in JSON format:
{
  "sentiment": "positive|negative|neutral",
  "summary": "brief summary",
  "keywords": ["keyword1", "keyword2"],
  "urgency": "low|medium|high"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a brand mention analyst. Analyze social media mentions and provide structured insights.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const result = JSON.parse(
    response.choices[0].message.content || "{}"
  ) as MentionAnalysis;

  return {
    sentiment: result.sentiment || "neutral",
    summary: result.summary || "",
    keywords: result.keywords || [],
    urgency: result.urgency || "low",
  };
}

export async function generateBrandReport(
  brandName: string,
  mentions: { content: string; sentiment: string }[]
): Promise<string> {
  const prompt = `Generate a concise brand report for "${brandName}" based on the following mentions:

${mentions
  .map(
    (m, i) =>
      `${i + 1}. [${m.sentiment}] ${m.content.substring(0, 200)}`
  )
  .join("\n")}

Provide insights on overall sentiment, key themes, and recommendations.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a brand analytics expert. Generate insightful reports based on brand mention data.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.5,
    max_tokens: 1000,
  });

  return response.choices[0].message.content || "";
}
