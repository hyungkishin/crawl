const fs = require("fs");
const path = require("path");

// [1] 기사 저장 함수
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

// [2] N일 이전까지의 날짜 배열 생성
function getPastDates(days, baseDate = new Date()) {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const yyyyMMdd = d.toISOString().slice(0, 10);
    dates.push(yyyyMMdd);
  }
  return dates;
}

// [3] 최근 N일치 파일 병합 (특정 기준 날짜부터)
function mergeRecentFiles(category, days = 14, baseDate = new Date(), baseDir = path.resolve(__dirname, "../data")) {
  const merged = [];
  const dates = getPastDates(days, baseDate);

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
