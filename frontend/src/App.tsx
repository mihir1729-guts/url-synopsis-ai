import { useState } from "react";
import { analyzeUrl, type AnalyzeResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { SynopsisDisplay } from "@/components/SynopsisDisplay";

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  async function handleAnalyze() {
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeUrl(url.trim());
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          URL Synopsis AI
        </h1>
        <p className="text-neutral-400 mb-8">
          Paste any article or YouTube link to get an AI-generated synopsis.
        </p>

        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            placeholder="https://example.com/article"
            className="flex-1 rounded-md bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600"
          />
          <Button onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        {result && (
          <div className="mt-8">
            <SynopsisDisplay data={result} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;