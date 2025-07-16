import Parser from "rss-parser";
import { classify } from "./classify.js";
import { saveArticles } from "./storage.js";
import { recommend } from "./recommend.js";

export async function main() {
  const parser = new Parser();
  const query = "biden"; // 원하는 키워드 바꿔서 실행 ㄱㄱ

  const feed = await parser.parseURL(
    `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`
  );

  const now = new Date();
  const timestamp = now.toISOString();
  const date = timestamp.slice(0, 10);

  const enriched = feed.items.map((item) => ({
    title: item.title,
    link: item.link,
    type: classify(item.title),
    crawledAt: timestamp,
    date,
    timestamp,
  }));

  console.log(`수집된 기사 수: ${enriched.length}`);
  saveArticles(enriched);

  console.log("\n 관심사 기반 추천 (발언/논평)");
  recommend("발언/논평").forEach((a, i) => {
    console.log(`${i + 1}. ${a.title} [${a.type}]`);
  });
}

// 직접 실행한 경우만 실행 합니다.
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
