import { useEffect, useState } from 'react'
import { getMe } from '../api/adminUser.api'
import { useAuth } from '../stores/authStore'

export const useUser = () => {
  const { user, accessToken, setUser, reset } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<null | Error>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (!user && accessToken) {
        try {
          const { userName, email } = await getMe()
          setUser({ accountNo: userName, email, role: [], exp: 0 })
        } catch (err) {
          reset()
          setError(err as Error)
        }
      }
      setIsLoading(false)
    }

    fetchUser()
  }, [user, accessToken])

  const uiUser = user
    ? {
        name: user.accountNo,
        email: user.email,
        avatar: '/avatars/shadcn.jpg',
      }
    : null

  return { isLoading, error, user: uiUser }
}
