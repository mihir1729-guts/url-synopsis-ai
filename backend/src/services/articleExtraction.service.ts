import axios from "axios";
import * as cheerio from "cheerio";

export interface ExtractedArticle {
  title: string;
  content: string;
  url: string;
}

export async function extractArticleContent(url: string): Promise<ExtractedArticle> {
  const response = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    timeout: 10000,
  });

  const $ = cheerio.load(response.data);

  $("script, style, nav, footer, header, aside, iframe, noscript").remove();

  const title =
    $("h1").first().text().trim() ||
    $("title").text().trim() ||
    "Untitled";

  const paragraphs: string[] = [];
  $("article p, main p, .content p, .post-content p, p").each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 40) {
      paragraphs.push(text);
    }
  });

  const content = paragraphs.join("\n\n");

  if (!content || content.length < 100) {
    throw new Error("Could not extract meaningful content from this URL.");
  }

  return { title, content, url };
}