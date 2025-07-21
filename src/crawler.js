// crawler.js
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

async function fetchAndSave(category) {
  const query = encodeURIComponent(category);
  const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;

  console.log(`📥 [${category}] RSS 수집 시작`);

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

  const today = new Date().toISOString().slice(0, 10);
  const safeCategory = category.replace(/\s+/g, "_");
  const outPath = path.resolve(__dirname, `../data/${today}/rss-${safeCategory}.jsonl`);

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
  for (const category of categories) {
    await fetchAndSave(category);
  }

  console.log("\n🟢 오늘자 전체 카테고리 수집 완료");
}

main();
