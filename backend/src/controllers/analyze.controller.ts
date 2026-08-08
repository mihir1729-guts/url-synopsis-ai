import { Request, Response } from "express";
import { detectUrlType } from "../services/urlDetection.service";
import { extractArticleContent } from "../services/articleExtraction.service";
import { extractYouTubeContent } from "../services/youtubeExtraction.service";
import { generateArticleSynopsis, generateYouTubeSynopsis } from "../services/ai.service";

export async function analyzeUrl(req: Request, res: Response) {
  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "A valid 'url' field is required." });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return res.status(400).json({ error: "The provided URL is not valid." });
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return res.status(400).json({ error: "Only http/https URLs are supported." });
  }

  try {
    const detection = detectUrlType(url);

    if (detection.contentType === "youtube") {
      const video = await extractYouTubeContent(url);
      const synopsis = await generateYouTubeSynopsis(video.transcript, video.segments);
      return res.status(200).json({
        contentType: "youtube",
        sourceUrl: url,
        synopsis,
      });
    } else {
      const article = await extractArticleContent(url);
      const synopsis = await generateArticleSynopsis(article.title, article.content);
      return res.status(200).json({
        contentType: "article",
        sourceUrl: url,
        title: article.title,
        synopsis,
      });
    }
  } catch (error) {
    console.error("Analyze error:", error);
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return res.status(500).json({ error: message });
  }
}