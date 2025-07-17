const fs = require("fs");
const path = require("path");

function saveArticles(articles) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const filename = `articles-${today}.jsonl`;
  const filePath = path.join(__dirname, `../data/${filename}`);

  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  const stream = fs.createWriteStream(filePath, { flags: "a" });
  articles.forEach((a) => {
    stream.write(JSON.stringify(a) + "\n");
  });
  stream.end();

  console.log(`저장 완료 : ${filename}`);
}
module.exports = { saveArticles };
