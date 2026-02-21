import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TopBarProps {
  title: string
  showBack?: boolean
  rightAction?: React.ReactNode
  className?: string
}

export function TopBar({ title, showBack, rightAction, className }: TopBarProps) {
  const navigate = useNavigate()

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 backdrop-blur-lg px-4 py-3 pt-safe',
        className
      )}
    >
      {showBack && (
        <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)} className="-ml-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      <h1 className="flex-1 text-lg font-semibold truncate">{title}</h1>
      {rightAction && <div className="flex items-center gap-2">{rightAction}</div>}
    </header>
  )
}
