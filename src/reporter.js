const fs = require("fs");
const path = require("path");

function generateMarkdownReport(category, trends, date = new Date()) {
  const today = date.toISOString().slice(0, 10);
  const safeCategory = category.replace(/\s+/g, "_");
  const outDir = path.resolve(__dirname, `../data/reports`);
  const outPath = path.join(outDir, `${today}-${safeCategory}.md`);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const { totalItems, topTypes, topKeywords } = trends;

  let md = `# 📊 ${category} - 최근 14일 트렌드 리포트\n\n`;
  md += `📅 날짜: ${today}\n`;
  md += `📰 기사 수집량: ${totalItems}건\n\n`;

  md += `## 🔢 Top Types\n\n`;
  topTypes.forEach(([type, count]) => {
    md += `- **${type}**: ${count}건\n`;
  });

  md += `\n## 🔤 Top Keywords\n\n`;
  topKeywords.forEach(([word, count]) => {
    md += `- \`${word}\`: ${count}회 등장\n`;
  });

  fs.writeFileSync(outPath, md, "utf-8");
  console.log(`📝 저장 완료: ${outPath}`);
}

module.exports = {
  generateMarkdownReport,
};
