import { client } from './client'

// 登录
export const login = async (email: string, password: string) => {
  const res = await client.auth.loginnocode.$post({
    json: {
      email: email,
      password: password,
    },
  })
  if (!res.ok) throw new Error('Failed to create post')
  return await res.json()
}

// 登出
