const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // 눈으로 확인 원하면 headless: false
  const page = await browser.newPage();

  // 진짜 뉴스 TOPIC URL (U.S.)
  await page.goto(
    "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFZxYUdjU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en",
    { waitUntil: "networkidle2", timeout: 0 }
  );

  // 충분한 스크롤
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const distance = 300;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        total += distance;
        if (total > document.body.scrollHeight * 1.5) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });

  await new Promise((r) => setTimeout(r, 2000));

  const articles = await page.evaluate(() => {
    const data = [];

    const items = document.querySelectorAll("a.JtKRv");

    items.forEach((a) => {
      const title = a.querySelector("h4")?.innerText || "";
      const source = a.querySelector(".vr1PYe")?.innerText || "";
      const time = a.querySelector("time")?.getAttribute("datetime") || "";
      let link = a.href;
      if (link.startsWith("./")) {
        link = "https://news.google.com" + link.slice(1);
      }
      const image = a.querySelector("img")?.src || null;

      if (title) {
        data.push({ title, link, source, time, image });
      }
    });

    return data;
  });

  await browser.close();

  console.log(`크롤링된 기사 수: ${articles.length}`);
  console.log(JSON.stringify(articles, null, 2));
})();
