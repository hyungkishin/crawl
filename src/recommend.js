import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, "../data/articles.jsonl");

export function recommend(interest = "발언/논평", max = 5) {
  if (!fs.existsSync(FILE)) return [];

  const lines = fs.readFileSync(FILE, "utf-8").split("\n").filter(Boolean);
  const articles = lines.map((line) => JSON.parse(line));

  return articles
    .filter((a) => a.type === interest)
    .sort((a, b) => new Date(b.crawledAt) - new Date(a.crawledAt))
    .slice(0, max);
}
