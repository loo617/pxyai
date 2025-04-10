import { db, lt } from "@pxyai/db";
import { captchas } from "@pxyai/db/src/schema";

export async function clearExpiredCaptchas() {
  try {
    const now = new Date();
    await db.delete(captchas).where(lt(captchas.expiresAt, now));
    console.log(`[cron] 清理过期验证码成功: ${now.toISOString()}`);
  } catch (error) {
    console.error("[cron] 清理验证码失败:", error);
  }
}
