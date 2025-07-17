function classify(title) {
  const t = title.toLowerCase();
  if (t.includes("says") || t.includes("claims") || t.includes("slams")) return "발언/논평";
  if (t.includes("bill") || t.includes("vote") || t.includes("policy")) return "정책/정치";
  if (t.includes("fire") || t.includes("dies") || t.includes("accident")) return "사건/사고";
  if (t.includes("gaza") || t.includes("military") || t.includes("war")) return "외교/군사";
  return "기타";
}
module.exports = { classify };