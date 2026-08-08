export type ContentType = "youtube" | "article";

export interface UrlDetectionResult {
  contentType: ContentType;
  originalUrl: string;
}
export interface Synopsis {
  executiveSummary: string;
  keyPoints: string[];
  detailedExplanation: string;
  importantFacts: string[];
  conclusion: string;
}

export interface YouTubeSynopsis extends Synopsis {
  timestampedSummary: { time: string; text: string }[];
  chapters: { title: string; startTime: string }[];
}