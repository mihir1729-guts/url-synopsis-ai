import OpenAI from "openai";
import { env } from "../config/env";
import { Synopsis, YouTubeSynopsis } from "../types";

const openai = new OpenAI({ apiKey: env.openaiApiKey });

const ARTICLE_SYSTEM_PROMPT = `You are an expert content analyst. You will be given the extracted text of an article, blog post, or webpage. Produce a comprehensive synopsis.

Respond with ONLY a valid JSON object, no markdown formatting, no code fences, matching exactly this shape:
{
  "executiveSummary": "2-3 sentence high-level overview",
  "keyPoints": ["array of 4-8 key points as strings"],
  "detailedExplanation": "A thorough paragraph explaining the content in depth, in plain accessible language",
  "importantFacts": ["array of notable facts, statistics, or data points mentioned"],
  "conclusion": "1-2 sentence wrap-up of the main takeaway"
}

Rules:
- Base everything strictly on the provided content. Do not invent facts.
- Explain technical concepts in simple, accessible language.
- Keep keyPoints concise (one sentence each).
- If the content is too short or unclear to summarize meaningfully, still return valid JSON with your best effort.`;

const YOUTUBE_SYSTEM_PROMPT = `You are an expert content analyst. You will be given a timestamped transcript of a YouTube video. Produce a comprehensive synopsis.

Respond with ONLY a valid JSON object, no markdown formatting, no code fences, matching exactly this shape:
{
  "executiveSummary": "2-3 sentence high-level overview",
  "keyPoints": ["array of 4-8 key points as strings"],
  "detailedExplanation": "A thorough paragraph explaining the video's content in depth, in plain accessible language",
  "importantFacts": ["array of notable facts, statistics, or data points mentioned"],
  "conclusion": "1-2 sentence wrap-up of the main takeaway",
  "timestampedSummary": [{"time": "MM:SS", "text": "what happens at this point"}],
  "chapters": [{"title": "chapter/topic name", "startTime": "MM:SS"}]
}

Rules:
- Base everything strictly on the transcript provided. Do not invent facts.
- Explain technical concepts in simple, accessible language.
- For timestampedSummary, pick 5-10 meaningful moments across the video, not every sentence.
- For chapters, identify 3-6 natural topic segments in the video.
- Convert millisecond offsets to MM:SS format.`;

function extractJson(raw: string): unknown {
  const cleaned = raw.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
  return JSON.parse(cleaned);
}

export async function generateArticleSynopsis(
  title: string,
  content: string
): Promise<Synopsis> {
  const truncated = content.slice(0, 15000);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: ARTICLE_SYSTEM_PROMPT },
      { role: "user", content: `Title: ${title}\n\nContent:\n${truncated}` },
    ],
    temperature: 0.3,
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("AI returned an empty response.");

  return extractJson(raw) as Synopsis;
}

export async function generateYouTubeSynopsis(
  transcript: string,
  segments: { text: string; offset: number }[]
): Promise<YouTubeSynopsis> {
  const timestampedText = segments
    .slice(0, 200)
    .map((s) => {
      const totalSeconds = Math.floor(s.offset / 1000);
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      return `[${mins}:${secs.toString().padStart(2, "0")}] ${s.text}`;
    })
    .join("\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: YOUTUBE_SYSTEM_PROMPT },
      { role: "user", content: `Transcript:\n${timestampedText}` },
    ],
    temperature: 0.3,
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("AI returned an empty response.");

  return extractJson(raw) as YouTubeSynopsis;
}