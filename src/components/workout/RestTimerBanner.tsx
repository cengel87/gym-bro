import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatTimer } from '@/lib/utils'

interface RestTimerBannerProps {
  durationSeconds: number
  onDone: (elapsedSeconds: number) => void
}

export function RestTimerBanner({ durationSeconds, onDone }: RestTimerBannerProps) {
  const [startedAt] = useState(() => Date.now())
  const [extraSeconds, setExtraSeconds] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const doneCalled = useRef(false)

  const totalDuration = durationSeconds + extraSeconds
  const remaining = Math.max(0, totalDuration - elapsed)
  const progress = Math.min(elapsed / totalDuration, 1)

  // Tick every 500ms for accuracy
  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000))
    }, 500)
    return () => clearInterval(id)
  }, [startedAt])

  // Auto-complete when countdown expires
  useEffect(() => {
    if (remaining === 0 && elapsed > 0 && !doneCalled.current) {
      doneCalled.current = true
      navigator.vibrate?.([150, 80, 150])
      onDone(elapsed)
    }
  }, [remaining, elapsed, onDone])

  function handleSkip() {
    if (!doneCalled.current) {
      doneCalled.current = true
      onDone(elapsed)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/20 bg-card/95 backdrop-blur-lg shadow-[0_-4px_24px_rgba(0,212,255,0.12)] pb-safe">
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Rest
          </span>
          <span className="text-3xl font-bold text-primary tabular-nums tracking-tight">
            {formatTimer(remaining)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-muted-foreground h-7 px-2 text-xs"
          >
            Skip
          </Button>
        </div>

        {/* Depleting progress bar */}
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${(1 - progress) * 100}%`, transition: 'width 1s linear' }}
          />
        </div>

        <div className="flex justify-center mt-2">
          <button
            onClick={() => setExtraSeconds((s) => s + 30)}
            className="text-xs text-muted-foreground hover:text-primary px-3 py-1 rounded-full transition-colors"
          >
            +30s
          </button>
        </div>
      </div>
    </div>
  )
}
