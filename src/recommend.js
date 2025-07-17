const fs = require("fs");
const path = require("path");

function recommend(interest = "발언/논평", max = 5) {
  const files = fs.readdirSync(path.join(__dirname, "../data"));
  const latest = files
    .filter((f) => f.startsWith("articles-") && f.endsWith(".jsonl"))
    .sort()
    .reverse()[0];

  if (!latest) return [];

  const lines = fs.readFileSync(path.join(__dirname, "../data", latest), "utf-8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  return lines
    .filter((a) => a.type === interest)
    .slice(0, max);
}

module.exports = { recommend };
