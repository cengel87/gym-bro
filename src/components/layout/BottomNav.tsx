import { NavLink, useLocation } from 'react-router-dom'
import { Home, Layout, TrendingUp, BookOpen, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/', label: 'Today', icon: Home },
  { path: '/templates', label: 'Templates', icon: Layout },
  { path: '/progress', label: 'Progress', icon: TrendingUp },
  { path: '/library', label: 'Library', icon: BookOpen },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export function BottomNav() {
  const location = useLocation()

  // Hide bottom nav during active workout
  if (location.pathname === '/workout/active') return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-lg pb-safe">
      <div className="flex items-stretch justify-around">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
          return (
            <NavLink
              key={path}
              to={path}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 px-2 py-3 min-w-[60px] tap-highlight-none transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
              )}
              <Icon
                className={cn(
                  'h-5 w-5 transition-transform',
                  isActive && 'scale-110 drop-shadow-[0_0_6px_rgba(0,212,255,0.5)]'
                )}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span className={cn('text-[10px]', isActive ? 'font-medium text-primary' : 'font-medium')}>{label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
