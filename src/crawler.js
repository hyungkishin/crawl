const Parser = require("rss-parser");
const { classify } = require("./classify");
const { saveArticles } = require("./storage");
const { recommend } = require("./recommend");

async function main() {
  const parser = new Parser();
  const query = "biden";

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

main();
