import type { AnalyzeResponse } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function SynopsisDisplay({ data }: { data: AnalyzeResponse }) {
  const { synopsis, contentType, title, sourceUrl } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant={contentType === "youtube" ? "destructive" : "secondary"}>
          {contentType === "youtube" ? "YouTube" : "Article"}
        </Badge>
        <a 
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-sm text-neutral-400 hover:text-neutral-200"
        >
          {title || sourceUrl}
        </a>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-neutral-100">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-neutral-300">
          {synopsis.executiveSummary}
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-neutral-100">Key Points</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {synopsis.keyPoints.map((point, i) => (
              <li key={i} className="flex gap-2 text-sm text-neutral-300">
                <span className="text-neutral-600">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-neutral-100">Detailed Explanation</CardTitle>
        </CardHeader>
        <CardContent className="whitespace-pre-line text-sm leading-relaxed text-neutral-300">
          {synopsis.detailedExplanation}
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-neutral-100">Important Facts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {synopsis.importantFacts.map((fact, i) => (
              <li key={i} className="flex gap-2 text-sm text-neutral-300">
                <span className="text-neutral-600">→</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {synopsis.chapters && synopsis.chapters.length > 0 && (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-neutral-100">Chapters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {synopsis.chapters.map((chapter, i) => (
              <div key={i}>
                {i > 0 && <Separator className="mb-2 bg-neutral-800" />}
                <div className="flex gap-3 text-sm">
                  <span className="font-mono text-neutral-500">
                    {chapter.startTime}
                  </span>
                  <span className="text-neutral-300">{chapter.title}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {synopsis.timestampedSummary && synopsis.timestampedSummary.length > 0 && (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-neutral-100">Timestamped Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {synopsis.timestampedSummary.map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="shrink-0 font-mono text-neutral-500">
                  {item.time}
                </span>
                <span className="text-neutral-300">{item.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-neutral-100">Conclusion</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-neutral-300">
          {synopsis.conclusion}
        </CardContent>
      </Card>
    </div>
  );
}
