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
  "Local_news",
];

const inputDate = process.argv[2];
const baseDate = inputDate ? new Date(inputDate) : new Date();

function printTable(title, rows) {
  console.log(`\n📌 ${title}`);
  console.table(
    rows.map(([key, value]) => ({
      label: key,
      count: value,
    }))
  );
}

for (const category of categories) {
  const data = mergeRecentFiles(category, 14, baseDate);
  if (data.length === 0) {
    console.log(`⚠️  [${category}] 데이터 없음`);
    continue;
  }

  const trends = analyzeTrends(data);

  console.log(`\n📰 [${category}] 최근 14일 트렌드 리포트 (총 ${trends.totalItems}건)`);
  printTable("Top Types", trends.topTypes);
  printTable("Top Keywords", trends.topKeywords);

  generateMarkdownReport(category, trends, baseDate);
}

console.log("\n✅ 전체 분석 완료");
