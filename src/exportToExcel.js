
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const xlsx = require("xlsx");

const parseJsonlFile = async (filePath) => {
  const lines = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  const items = [];
  for await (const line of lines) {
    if (!line.trim()) continue;
    try {
      items.push(JSON.parse(line));
    } catch (e) {
      console.error(`❌ JSON 파싱 실패: ${line}`);
    }
  }

  return items;
};

const groupByCategory = (data, fallbackName) => {
  const map = {};
  for (const item of data) {
    const category = item.category || fallbackName;
    if (!map[category]) map[category] = [];
    map[category].push(item);
  }
  return map;
};

const exportToExcel = async (targetDir) => {
  const fullDirPath = path.resolve("data", targetDir);
  const files = fs.readdirSync(fullDirPath).filter((f) => f.endsWith(".jsonl"));

  const workbook = xlsx.utils.book_new();

  for (const fileName of files) {
    const filePath = path.join(fullDirPath, fileName);
    const jsonItems = await parseJsonlFile(filePath);

    const grouped = groupByCategory(jsonItems, path.basename(fileName, ".jsonl"));

    for (const [category, rows] of Object.entries(grouped)) {
      const worksheet = xlsx.utils.json_to_sheet(rows);
      const sheetName = category.substring(0, 31); // 엑셀 시트 이름 제한
      xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
    }
  }

  // 저장
  const outputDir = path.resolve("export");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const outputFile = path.join(outputDir, `${targetDir}.xlsx`);
  xlsx.writeFile(workbook, outputFile);

  console.log(`✅ 엑셀 저장 완료: ${outputFile}`);
};

// CLI 실행
const [, , inputDate] = process.argv;
if (!inputDate) {
  console.error("❗ 날짜 폴더명을 입력하세요 (예: 2025-08-04)");
  process.exit(1);
}

exportToExcel(inputDate);