import { getAuthorizedClient } from './client'

//获取当前用户信息
export const getMe = async () => {
  const client = getAuthorizedClient()
  const res = await client.v1.adminUser.me.$get()
  if (!res.ok) throw new Error('Failed to get user detail')
  return await res.json()
}
