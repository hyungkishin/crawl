// recommend.js

function analyzeTrends(data = []) {
  const typeCount = {};
  const keywordFreq = {};

  for (const item of data) {
    const { type, title } = item;

    // type 집계
    if (type) typeCount[type] = (typeCount[type] || 0) + 1;

    // keyword 빈도 집계 (title 기준)
    const words = title
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length >= 4); // 짧은 단어 제외

    words.forEach((word) => {
      keywordFreq[word] = (keywordFreq[word] || 0) + 1;
    });
  }

  // 상위 유형 5개, 키워드 10개만 추림
  const topTypes = Object.entries(typeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topKeywords = Object.entries(keywordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return {
    totalItems: data.length,
    topTypes,
    topKeywords,
  };
}

module.exports = {
  analyzeTrends,
};
