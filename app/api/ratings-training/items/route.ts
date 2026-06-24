import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export interface RatingsTrainingItem {
  slackType: "exchange-link" | "no-company-found";
  agency: string;   // "moodys" | "s&p" | "fitch" — for exchange-link
  articleId: string; // numeric string — for exchange-link display
  title: string;
  correctAnswer: string; // "publish"|"ignore" | "cfr"|"instruments"|"remove"
  company: string;
  explanation: string;
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

const VALID_TYPES = new Set(["exchange-link", "no-company-found"]);
const VALID_ANSWERS = new Set(["publish", "ignore", "cfr", "instruments", "remove"]);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const countParam = searchParams.get("count");
  const count = countParam === "all"
    ? Infinity
    : Math.min(parseInt(countParam ?? "10", 10), 200);

  const csvPath = path.join(process.cwd(), "data", "ratings-training.csv");
  const content = fs.readFileSync(csvPath, "utf-8");
  const lines = content.split("\n").filter((l) => l.trim());

  const headers = parseCSVLine(lines[0]);
  const slackTypeIdx = headers.indexOf("Slack Type");
  const agencyIdx = headers.indexOf("Agency");
  const articleIdIdx = headers.indexOf("Article ID");
  const titleIdx = headers.indexOf("Article Title");
  const answerIdx = headers.indexOf("Correct Answer");
  const companyIdx = headers.indexOf("Company");
  const explanationIdx = headers.indexOf("Explanation");

  const items: RatingsTrainingItem[] = lines
    .slice(1)
    .map((line) => {
      const v = parseCSVLine(line);
      return {
        slackType: (v[slackTypeIdx] ?? "") as RatingsTrainingItem["slackType"],
        agency: v[agencyIdx] ?? "",
        articleId: v[articleIdIdx] ?? "",
        title: v[titleIdx] ?? "",
        correctAnswer: v[answerIdx] ?? "",
        company: v[companyIdx] ?? "",
        explanation: v[explanationIdx] ?? "",
      };
    })
    .filter(
      (item) =>
        item.title &&
        VALID_TYPES.has(item.slackType) &&
        VALID_ANSWERS.has(item.correctAnswer)
    );

  const selected = shuffle(items).slice(0, count);
  return Response.json({ items: selected });
}
