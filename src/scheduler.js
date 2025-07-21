// src/scheduler.js

const { mergeRecentFiles } = require("./storage");
const { analyzeTrends } = require("./recommend");
const { generateMarkdownReport } = require("./reporter");

const categories = [
  "U.S.",
  "Technology",
  "Business",
  "Finance",
  "Mobile",
  "Gadgets",
  "Local_news", // <- 파일명 기준 (공백 -> _ 치환)
];

function printTable(title, rows) {
  console.log(`\n📌 ${title}`);
  console.table(
    rows.map(([key, value]) => ({
      label: key,
      count: value,
    }))
  );
}

const today = new Date();

for (const category of categories) {
  const data = mergeRecentFiles(category, 14);
  if (data.length === 0) {
    console.log(`⚠️  [${category}] 데이터 없음`);
    continue;
  }

  const { totalItems, topTypes, topKeywords } = analyzeTrends(data);

  console.log(`\n📰 [${category}] 최근 14일 트렌드 리포트 (총 ${totalItems}건)`);

  printTable("Top Types", topTypes);
  printTable("Top Keywords", topKeywords);
  generateMarkdownReport(category, { totalItems, topTypes, topKeywords }, today);
}

console.log("\n✅ 전체 분석 완료");
