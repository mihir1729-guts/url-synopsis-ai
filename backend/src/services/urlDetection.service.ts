import { ContentType, UrlDetectionResult } from "../types";

export function detectUrlType(url: string): UrlDetectionResult {
  const isYouTube =
    url.includes("youtube.com/watch") ||
    url.includes("youtu.be/") ||
    url.includes("youtube.com/shorts");

  const contentType: ContentType = isYouTube ? "youtube" : "article";

  return {
    contentType,
    originalUrl: url,
  };
}