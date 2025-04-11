import { randomUUID } from "crypto";
import { describe, expect, test } from "vitest";
import app from "../src/index";

describe("auth test", () => {
  test("loginnocode test", async () => {
    //用admin登录并获取token
    const res2 = await app.request("/auth/loginnocode", {
      method: "POST",
      body: JSON.stringify({
        email: "251803283@qq.com",
        password: "123456",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const body2 = await res2.json();
    console.log("Response body:", body2);
    expect(res2.status).toBe(200);

    //用token获取用户信息
    const res3 = await app.request("/api/auth/getme", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${body2.token}`,
      },
    });
    const body3 = await res3.json();
    console.log("Response body:", body3);
    expect(res3.status).toBe(200);
    expect(body3.email).toBe("testuser@example.com");
  });
});
