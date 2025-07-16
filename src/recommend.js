const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "../data/articles.jsonl");

function recommendArticles(userInterest = "정책/정치", max = 5) {
  if (!fs.existsSync(DATA_PATH)) return [];

  const all = fs.readFileSync(DATA_PATH, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map(JSON.parse);

  return all
    .filter((a) => a.type === userInterest)
    .sort((a, b) => new Date(b.crawledAt) - new Date(a.crawledAt))
    .slice(0, max);
}

module.exports = { recommendArticles };
