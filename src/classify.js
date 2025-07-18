function classify(title) {
  if (/biden|trump|election|white house/i.test(title)) return "정치";
  if (/ai|chatgpt|google|microsoft|openai|tech/i.test(title)) return "기술";
  if (/stock|finance|market|nasdaq|s&p/i.test(title)) return "경제";
  return "기타";
}

module.exports = { classify };