export function classify(title) {
  const t = title.toLowerCase();
  if (t.includes("says") || t.includes("slams") || t.includes("claims")) return "발언/논평";
  if (t.includes("bill") || t.includes("vote") || t.includes("policy")) return "정책/정치";
  if (t.includes("fire") || t.includes("dies") || t.includes("accident")) return "사건/사고";
  if (t.includes("conflict") || t.includes("gaza") || t.includes("military")) return "외교/군사";
  if (t.includes("market") || t.includes("stock") || t.includes("inflation")) return "경제/비즈";
  return "기타";
}
