import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getAccessTokenFromCookie, useAuth } from '@/stores/authStore'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const token = getAccessTokenFromCookie()
    if (!token) {
      throw redirect({ to: '/sign-in' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { accessToken, setAccessToken } = useAuth()

  // 初次进入页面时同步 Cookie -> Zustand
  useEffect(() => {
    if (!accessToken) {
      const token = getAccessTokenFromCookie()
      if (token) setAccessToken(token)
    }
  }, [accessToken, setAccessToken])

  const defaultOpen = Cookies.get('sidebar:state') !== 'false'
  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <div
          id='content'
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] duration-200 ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
          )}
        >
          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}
