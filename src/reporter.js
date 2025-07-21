const fs = require("fs");
const path = require("path");
const { mergeRecentFiles } = require("./storage");
const { analyzeTrends } = require("./recommend");

function generateMarkdownReport(category, trends, date = new Date()) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const dateStr = dateObj.toISOString().slice(0, 10);
  const safeCategory = category.replace(/\s+/g, "_");
  const outDir = path.resolve(__dirname, `../data/reports/${dateStr}`);
  const outPath = path.join(outDir, `${safeCategory}.md`);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const { totalItems, topTypes, topKeywords } = trends;

  let md = `# 📊 ${category} - 최근 14일 트렌드 리포트\n\n`;
  md += `📅 날짜: ${dateStr}\n`;
  md += `📰 기사 수집량: ${totalItems}건\n\n`;

  md += `## 🔢 Top Types\n\n`;
  if (topTypes.length === 0) {
    md += `- (데이터 없음)\n`;
  } else {
    topTypes.forEach(([type, count]) => {
      md += `- **${type}**: ${count}건\n`;
    });
  }

  md += `\n## 🔤 Top Keywords\n\n`;
  if (topKeywords.length === 0) {
    md += `- (데이터 없음)\n`;
  } else {
    topKeywords.forEach(([word, count]) => {
      md += `- \`${word}\`: ${count}회 등장\n`;
    });
  }

  fs.writeFileSync(outPath, md, "utf-8");
  console.log(`📝 저장 완료: ${outPath}`);
}

// 👉 CLI에서 직접 실행 가능하도록 추가
if (require.main === module) {
  const inputDate = process.argv[2];
  if (!inputDate) {
    console.error("❌ 날짜를 입력하세요. 예: node reporter.js 2025-06-01");
    process.exit(1);
  }

  const categories = [
    "U.S.",
    "Technology",
    "Business",
    "Finance",
    "Mobile",
    "Gadgets",
    "Local_news",
  ];

  const baseDate = new Date(inputDate); // e.g. 2025-06-01

  for (const category of categories) {
    const data = mergeRecentFiles(category, 14, baseDate); // 이 날짜 기준으로 14일
    const trends = analyzeTrends(data);
    generateMarkdownReport(category, trends, baseDate);
  }

  console.log("✅ 모든 카테고리에 대해 리포트 생성 완료");
}

module.exports = {
  generateMarkdownReport,
};
