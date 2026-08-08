import { YoutubeTranscript } from "youtube-transcript";

export interface ExtractedYouTube {
  videoId: string;
  transcript: string;
  segments: { text: string; offset: number; duration: number }[];
}

function extractVideoId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/shorts\/)([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  throw new Error("Could not extract video ID from YouTube URL.");
}

export async function extractYouTubeContent(url: string): Promise<ExtractedYouTube> {
  const videoId = extractVideoId(url);

  const rawSegments = await YoutubeTranscript.fetchTranscript(videoId);

  if (!rawSegments || rawSegments.length === 0) {
    throw new Error("No transcript available for this video.");
  }

  const segments = rawSegments.map((seg) => ({
    text: seg.text,
    offset: seg.offset,
    duration: seg.duration,
  }));

  const transcript = segments.map((s) => s.text).join(" ");

  return { videoId, transcript, segments };
}