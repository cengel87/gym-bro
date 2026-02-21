import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect } from 'react'
import { queryClient } from '@/lib/queryClient'
import { AppRouter } from '@/router'
import { useSettings } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, useToastState } from '@/components/ui/toast'

function ThemeManager() {
  const { user } = useAuth()
  const { data: settings } = useSettings(user?.id)

  useEffect(() => {
    const theme = settings?.theme ?? 'dark'
    const root = document.documentElement
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', prefersDark)
    } else {
      root.classList.toggle('dark', theme === 'dark')
    }
  }, [settings?.theme])

  return null
}

function Toaster() {
  const toasts = useToastState()
  return (
    <ToastProvider>
      {toasts.map((t) => (
        <Toast key={t.id} open={t.open} variant={t.variant}>
          <div className="grid gap-1">
            <ToastTitle>{t.title}</ToastTitle>
            {t.description && <ToastDescription>{t.description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeManager />
        <AppRouter />
        <Toaster />
      </BrowserRouter>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
