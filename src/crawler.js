const Parser = require("rss-parser");
const fs = require("fs");
const path = require("path");
const { classify } = require("./classify"); // 각 기사 제목에 대해 유형 분류 함수

async function main() {
  const parser = new Parser();
  const date = new Date().toISOString().slice(0, 10);

  const categories = [
    "U.S.",
    "Technology",
    "Business",
    "Finance",
    "Mobile",
    "Gadgets",
    "Local news",
  ];

  for (const category of categories) {
    const query = encodeURIComponent(category);
    const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;

    console.log(`🔍 ${category} 크롤링 중...`);

    let feed;
    try {
      feed = await parser.parseURL(rssUrl);
    } catch (err) {
      console.error(`❌ [${category}] RSS 파싱 실패: ${err.message}`);
      continue;
    }

    const enriched = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      category,
      type: classify(item.title),
      timestamp: new Date().toISOString(),
    }));

    // 저장 경로 설정
    const date = new Date().toISOString().slice(0, 10);
    const safeCategory = category.replace(/\s+/g, "_");
    const outPath = path.resolve(
      __dirname,
      `../data/${date}/rss-${safeCategory}.jsonl`
    );
    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    const stream = fs.createWriteStream(outPath, { flags: "a" });
    enriched.forEach((item) => {
      stream.write(JSON.stringify(item) + "\n");
    });
    stream.end();

    console.log(`✅ [${category}] ${enriched.length}건 저장됨 → ${outPath}`);
  }

  console.log("🟢 모든 카테고리 수집 완료");
}

main();
