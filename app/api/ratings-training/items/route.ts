import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export interface RatingsTrainingItem {
  title: string;
  company: string;
  correctAnswer: "Publish" | "Ignore";
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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const count = Math.min(parseInt(searchParams.get("count") ?? "10", 10), 50);

  const csvPath = path.join(process.cwd(), "data", "ratings-training.csv");
  const content = fs.readFileSync(csvPath, "utf-8");
  const lines = content.split("\n").filter((l) => l.trim());

  const headers = parseCSVLine(lines[0]);
  const titleIdx = headers.indexOf("Article Title");
  const actionIdx = headers.indexOf("Action");
  const companyIdx = headers.indexOf("Company");

  const items: RatingsTrainingItem[] = lines
    .slice(1)
    .map((line) => {
      const v = parseCSVLine(line);
      return {
        title: v[titleIdx] ?? "",
        company: v[companyIdx] ?? "",
        correctAnswer: (v[actionIdx] ?? "") as "Publish" | "Ignore",
      };
    })
    .filter((item) => item.title && (item.correctAnswer === "Publish" || item.correctAnswer === "Ignore"));

  const selected = shuffle(items).slice(0, count);
  return Response.json({ items: selected });
}
