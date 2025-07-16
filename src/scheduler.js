import cron from "node-cron";
import { main as crawlMain } from "./crawler.js";

cron.schedule("0 9 * * *", async () => {
  console.log(`[${new Date().toISOString()}] 자동 실행 시작`);
  await crawlMain();
});

console.log("대기 중: 매일 09:00 자동 실행...");