import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

export function PageContainer({ children, className, noPadding }: PageContainerProps) {
  return (
    <main
      className={cn(
        'min-h-screen pb-24', // pb-24 = space for bottom nav
        !noPadding && 'px-4',
        className
      )}
    >
      {children}
    </main>
  )
}
