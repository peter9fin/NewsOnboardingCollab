import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export interface TrainingItem {
  title: string;
  source: string;
  correctAnswer: string;
  triageOutcome: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Seed-based shuffle so the same seed gives the same order (useful later for
// reproducible sessions), but a random seed gives a new set each time.
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const EXCLUDED_ANSWERS = new Set(["", "Publish Now"]);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const count = Math.min(parseInt(searchParams.get("count") ?? "10", 10), 50);

  const csvPath = path.join(
    process.cwd(),
    "data",
    "training-articles.csv"
  );
  const content = fs.readFileSync(csvPath, "utf-8");
  const lines = content.split("\n").filter((l) => l.trim());

  const headers = parseCSVLine(lines[0]);
  const sourceIdx = headers.indexOf("Source Name");
  const firstActionIdx = headers.indexOf("First Action Decision");
  const lastActionIdx = headers.indexOf("Last Action Decision");
  const outcomeIdx = headers.indexOf("Triage Outcome");
  const titleIdx = headers.indexOf("Article Title");

  const items: TrainingItem[] = lines
    .slice(1)
    .map((line) => {
      const v = parseCSVLine(line);
      return {
        title: v[titleIdx] ?? "",
        source: v[sourceIdx] ?? "",
        correctAnswer: v[lastActionIdx] ?? "",
        triageOutcome: v[outcomeIdx] ?? "",
        firstAction: v[firstActionIdx] ?? "",
      };
    })
    .filter(
      (item) =>
        item.title &&
        item.correctAnswer &&
        !EXCLUDED_ANSWERS.has(item.correctAnswer)
    )
    .map(({ title, source, correctAnswer, triageOutcome }) => ({
      title,
      source,
      correctAnswer,
      triageOutcome,
    }));

  const selected = shuffle(items).slice(0, count);

  return Response.json({ items: selected });
}
