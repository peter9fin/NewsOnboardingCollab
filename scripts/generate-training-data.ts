/**
 * Build-time script: converts CSV training data to JSON for static export.
 * Run with: npx tsx scripts/generate-training-data.ts
 * Outputs: data/training-items.json, data/ratings-items.json
 */

import fs from "fs";
import path from "path";

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

const dataDir = path.join(__dirname, "..", "data");

// ─── 9news training items ───────────────────────────────────────────────────

const trainingCSV = fs.readFileSync(path.join(dataDir, "training-articles.csv"), "utf-8");
const trainingLines = trainingCSV.split("\n").filter((l) => l.trim());
const trainingHeaders = parseCSVLine(trainingLines[0]);

const sourceIdx = trainingHeaders.indexOf("Source Name");
const lastActionIdx = trainingHeaders.indexOf("Last Action Decision");
const outcomeIdx = trainingHeaders.indexOf("Triage Outcome");
const titleIdx = trainingHeaders.indexOf("Article Title");
const reasoningIdx = trainingHeaders.indexOf("Reasoning");

const EXCLUDED_ANSWERS = new Set(["", "Publish Now"]);

const trainingItems = trainingLines
  .slice(1)
  .map((line) => {
    const v = parseCSVLine(line);
    return {
      title: v[titleIdx] ?? "",
      source: v[sourceIdx] ?? "",
      correctAnswer: v[lastActionIdx] ?? "",
      triageOutcome: v[outcomeIdx] ?? "",
      reasoning: v[reasoningIdx] ?? "",
    };
  })
  .filter(
    (item) =>
      item.title &&
      item.correctAnswer &&
      !EXCLUDED_ANSWERS.has(item.correctAnswer)
  );

fs.writeFileSync(
  path.join(dataDir, "training-items.json"),
  JSON.stringify(trainingItems, null, 2)
);
console.log(`✓ training-items.json: ${trainingItems.length} items`);

// ─── Ratings training items ─────────────────────────────────────────────────

const ratingsCSV = fs.readFileSync(path.join(dataDir, "ratings-training.csv"), "utf-8");
const ratingsLines = ratingsCSV.split("\n").filter((l) => l.trim());
const ratingsHeaders = parseCSVLine(ratingsLines[0]);

const slackTypeIdx = ratingsHeaders.indexOf("Slack Type");
const agencyIdx = ratingsHeaders.indexOf("Agency");
const articleIdIdx = ratingsHeaders.indexOf("Article ID");
const rTitleIdx = ratingsHeaders.indexOf("Article Title");
const answerIdx = ratingsHeaders.indexOf("Correct Answer");
const companyIdx = ratingsHeaders.indexOf("Company");
const explanationIdx = ratingsHeaders.indexOf("Explanation");

const VALID_TYPES = new Set(["exchange-link", "no-company-found"]);
const VALID_ANSWERS = new Set(["publish", "ignore", "cfr", "instruments", "remove"]);

const ratingsItems = ratingsLines
  .slice(1)
  .map((line) => {
    const v = parseCSVLine(line);
    return {
      slackType: v[slackTypeIdx] ?? "",
      agency: v[agencyIdx] ?? "",
      articleId: v[articleIdIdx] ?? "",
      title: v[rTitleIdx] ?? "",
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

fs.writeFileSync(
  path.join(dataDir, "ratings-items.json"),
  JSON.stringify(ratingsItems, null, 2)
);
console.log(`✓ ratings-items.json: ${ratingsItems.length} items`);
