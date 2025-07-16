const fs = require("fs");
const path = require("path");
const { classifyArticleType } = require("./classify");

const DATA_PATH = path.join(__dirname, "../data/articles.jsonl");

function saveArticles(articles) {
  if (!fs.existsSync("./data")) fs.mkdirSync("./data");

  const existingTitles = new Set(
    fs.existsSync(DATA_PATH)
      ? fs.readFileSync(DATA_PATH, "utf-8")
          .split("\n")
          .filter(Boolean)
          .map((line) => JSON.parse(line).title)
      : []
  );

  const newEntries = articles
    .filter((a) => !existingTitles.has(a.title))
    .map((a) => ({
      ...a,
      type: classifyArticleType(a.title),
      crawledAt: new Date().toISOString(),
    }));

  fs.appendFileSync(
    DATA_PATH,
    newEntries.map((a) => JSON.stringify(a)).join("\n") + "\n"
  );
}

module.exports = { saveArticles };
