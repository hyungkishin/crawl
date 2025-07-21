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

// ✅ 최근 N일치 파일 병합해서 배열로 리턴하는 함수
function getPastDates(days) {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const yyyyMMdd = d.toISOString().slice(0, 10);
    dates.push(yyyyMMdd);
  }
  return dates;
}

function mergeRecentFiles(category, days = 14, baseDir = path.resolve(__dirname, "../data")) {
  const merged = [];

  const dates = getPastDates(days);
  for (const date of dates) {
    const safeCategory = category.replace(/\s+/g, "_");
    const filePath = path.join(baseDir, date, `rss-${safeCategory}.jsonl`);
    if (!fs.existsSync(filePath)) continue;

    const lines = fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);
    lines.forEach((line) => {
      try {
        merged.push(JSON.parse(line));
      } catch (e) {
        console.warn(`❗ JSON parse error in ${filePath}`);
      }
    });
  }

  return merged;
}

module.exports = {
  saveArticles,
  mergeRecentFiles,
};
