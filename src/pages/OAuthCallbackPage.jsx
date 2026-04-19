import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function OAuthCallbackPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const hasRun = useRef(false)

  useEffect(() => {
    // Prevent running twice in React StrictMode
    if (hasRun.current) return
    hasRun.current = true

    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const error = params.get('error')

    if (error) {
      navigate('/login?error=' + encodeURIComponent(error))
      return
    }

    if (token) {
      try {
        const parts = token.split('.')
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
        const padded = base64 + '=='.slice(0, (4 - base64.length % 4) % 4)
        const payload = JSON.parse(atob(padded))

        login(
          { email: payload.sub, name: payload.name || payload.sub },
          token
        )
      } catch {
        login({ email: 'Google User', name: 'Google User' }, token)
      }
      navigate('/dashboard', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }, [])

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-400">Completing Google sign in...</p>
      </div>
    </div>
  )
}

export default OAuthCallbackPage