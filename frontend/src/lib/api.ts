export interface Synopsis {
  executiveSummary: string;
  keyPoints: string[];
  detailedExplanation: string;
  importantFacts: string[];
  conclusion: string;
  timestampedSummary?: { time: string; text: string }[];
  chapters?: { title: string; startTime: string }[];
}

export interface AnalyzeResponse {
  contentType: "article" | "youtube";
  sourceUrl: string;
  title?: string;
  synopsis: Synopsis;
}

const API_BASE_URL = `${import.meta.env.VITE_API_URL ?? "http://localhost:3001"}/api`;

export async function analyzeUrl(url: string): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}