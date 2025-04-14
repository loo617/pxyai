// import { describe, expect, test } from "vitest";
// import app from "../src/index";
// import { randomUUID } from "crypto";

// describe("adminuser test", () => {
//   let insertedUserId: number;
//   const prefix = randomUUID().replace(/-/g, "");
//   test("insert adminuser", async () => {
//     const res = await app.request("/api/adminuser", {
//       method: "POST",
//       body: JSON.stringify({
//         userName: prefix,
//         email: "testuser@example.com",
//         password: "123456",
//         isSuperadmin: 1,
//         isActive: 1,
//       }),
//       headers: { "Content-Type": "application/json" },
//     });
//     const body = await res.json();
//     console.log("Response body:", body);
//     expect(res.status).toBe(201);

//     // 记录插入用户的 ID
//     insertedUserId = body.id;

//     // 简单字段校验
//     expect(body.userName).toBe(prefix);
//     expect(body.email).toBe("testuser@example.com");
//   });

//   // 通过刚插入的 ID 获取用户
//   test("get adminuser by id", async () => {
//     const res = await app.request(`/api/adminuser/${insertedUserId}`, {
//       method: "GET",
//     });

//     expect(res.status).toBe(200);

//     const data = await res.json();

//     // 验证字段存在与值是否一致
//     expect(data).toHaveProperty("id", insertedUserId);
//     expect(data).toHaveProperty("userName", prefix);
//     expect(data).toHaveProperty("email", "testuser@example.com");
//   });

//   // 获取用户列表并确保有插入的用户
//   test("get adminuser list", async () => {
//     const res = await app.request("/api/adminuser", {
//       method: "GET",
//     });

//     expect(res.status).toBe(200);

//     const json = await res.json();
//     expect(Array.isArray(json.data)).toBe(true);

//     const found = json.data.find((u: any) => u.id === insertedUserId);
//     expect(found).toBeDefined();
//   });

//   // 清理测试数据
//   test("delete inserted adminuser", async () => {
//     const res = await app.request(`/api/adminuser/${insertedUserId}`, {
//       method: "DELETE",
//     });

//     expect(res.status).toBe(200);

//     const msg = await res.json();
//     expect(msg).toEqual({ message: "User deleted successfully" });
//   });
// });
