import Cookies from 'js-cookie'
import type { AppType } from '@pxyai/admin_api'
import { hc } from 'hono/client'

const BASE_URL = 'http://localhost:3000'
const ACCESS_TOKEN = 'thisisjustarandomstring'

// 基础 client：无认证 headers
export const baseClient = hc<AppType>(BASE_URL)

// 获取带认证 headers 的 client
export const getAuthorizedClient = () => {
  const token = Cookies.get(ACCESS_TOKEN)

  if (!token) {
    throw new Error('No access token found')
  }

  return hc<AppType>(BASE_URL, {
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  })
}
