function classifyArticleType(title) {
  const keywordMap = [
    { type: "정책/정치", keywords: ["vote", "senate", "bill", "campaign", "congress"] },
    { type: "갈등/외교", keywords: ["threaten", "attack", "sanction", "strike", "conflict"] },
    { type: "발언/논평", keywords: ["says", "claims", "calls", "tells", "slams"] },
    { type: "사건/사고", keywords: ["crash", "arrest", "shooting", "killed", "dies", "fire"] },
    { type: "경제/비즈", keywords: ["market", "inflation", "stock", "startup", "economy"] }
  ];

  const lower = title.toLowerCase();
  for (const { type, keywords } of keywordMap) {
    if (keywords.some(k => lower.includes(k))) return type;
  }
  return "기타";
}

module.exports = { classifyArticleType };
