import type { AppType } from '@pxyai/admin_api'
import { hc } from 'hono/client'

export const client = hc<AppType>('http://localhost:3000/')
