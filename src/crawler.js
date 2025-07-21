const Parser = require("rss-parser");
const fs = require("fs");
const path = require("path");
const { classify } = require("./classify");

const parser = new Parser();

const categories = [
  "U.S.",
  "Technology",
  "Business",
  "Finance",
  "Mobile",
  "Gadgets",
  "Local news",
];

// 날짜 유틸: YYYY-MM-DD 문자열 → Date 객체
function parseDateArg() {
  const arg = process.argv[2];
  if (!arg) return new Date(); // 기본 오늘
  const d = new Date(arg);
  if (isNaN(d)) {
    console.error("❌ 날짜 포맷이 잘못됨. YYYY-MM-DD 형식으로 입력하세요.");
    process.exit(1);
  }
  return d;
}

async function fetchAndSave(category, targetDateStr) {
  const query = encodeURIComponent(category);
  const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;

  console.log(`📥 [${targetDateStr}][${category}] RSS 수집 시작`);

  let feed;
  try {
    feed = await parser.parseURL(rssUrl);
  } catch (err) {
    console.error(`❌ [${category}] RSS 파싱 실패: ${err.message}`);
    return;
  }

  const enriched = feed.items.map((item) => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    category,
    type: classify(item.title),
    timestamp: new Date().toISOString(),
  }));

  const safeCategory = category.replace(/\s+/g, "_");
  const outPath = path.resolve(__dirname, `../data/${targetDateStr}/rss-${safeCategory}.jsonl`);

  if (!fs.existsSync(path.dirname(outPath))) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
  }

  const stream = fs.createWriteStream(outPath, { flags: "a" });
  enriched.forEach((item) => {
    stream.write(JSON.stringify(item) + "\n");
  });
  stream.end();

  console.log(`✅ [${category}] ${enriched.length}건 저장 완료 → ${outPath}`);
}

async function main() {
  const targetDate = parseDateArg(); // Date 객체
  const targetDateStr = targetDate.toISOString().slice(0, 10); // YYYY-MM-DD

  for (const category of categories) {
    await fetchAndSave(category, targetDateStr);
  }

  console.log(`\n🟢 ${targetDateStr} 기준 전체 카테고리 수집 완료`);
}

main();
