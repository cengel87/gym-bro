import { useParams } from 'react-router-dom'
import { TopBar } from '@/components/layout/TopBar'
import { PageContainer } from '@/components/layout/PageContainer'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useExercise } from '@/hooks/useExercises'
import { useAuth } from '@/hooks/useAuth'
import { useExercise1RM } from '@/hooks/useProgressData'
import { useExerciseHistory } from '@/hooks/useSessions'
import { muscleLabel, formatDate, formatWeight } from '@/lib/utils'
import { useSettings } from '@/hooks/useProfile'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

export function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { data: exercise, isLoading } = useExercise(id)
  const { data: settings } = useSettings(user?.id)
  const { data: oneRmData } = useExercise1RM(user?.id, id)
  const { data: history } = useExerciseHistory(user?.id, id, 20)

  const unit = (settings?.unit_system ?? 'kg') as 'kg' | 'lbs'

  if (isLoading) {
    return (
      <>
        <TopBar title="Exercise" showBack />
        <PageContainer>
          <Skeleton className="h-24 w-full mt-4" />
        </PageContainer>
      </>
    )
  }

  if (!exercise) return null

  const chartData = (oneRmData ?? []).map((d) => ({
    date: formatDate(d.session_date),
    '1RM': unit === 'lbs' ? Math.round(d.estimated_1rm_kg * 2.20462) : d.estimated_1rm_kg,
  }))

  return (
    <>
      <TopBar title={exercise.name} showBack />
      <PageContainer>
        <div className="py-4 space-y-4">
          {/* Muscles */}
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {exercise.primary_muscles.map((m) => (
                <Badge key={m} variant="default">{muscleLabel(m)}</Badge>
              ))}
              {exercise.secondary_muscles.map((m) => (
                <Badge key={m} variant="secondary">{muscleLabel(m)}</Badge>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="capitalize">{exercise.equipment}</Badge>
              <Badge variant="outline" className="capitalize">{exercise.movement_pattern.replace('_', ' ')}</Badge>
              {exercise.mechanics && <Badge variant="outline" className="capitalize">{exercise.mechanics}</Badge>}
            </div>
          </div>

          {/* 1RM Chart */}
          {chartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Estimated 1RM Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" unit={unit} />
                    <Tooltip
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                    />
                    <Line type="monotone" dataKey="1RM" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* History */}
          <div>
            <h3 className="font-semibold mb-3">Recent Sessions</h3>
            {history?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No history yet — log this exercise to see data.</p>
            ) : (
              <div className="space-y-2">
                {history?.slice(0, 10).map((we) => {
                  const workingSets = (we.sets ?? []).filter(s => s.set_type === 'working' && s.is_completed)
                  if (workingSets.length === 0) return null
                  const bestLoad = Math.max(...workingSets.map(s => s.effective_load_kg ?? 0))
                  const displayLoad = unit === 'lbs' ? Math.round(bestLoad * 2.20462) : bestLoad
                  const reps = workingSets.map(s => s.reps_completed).filter(Boolean)
                  const sessionDate = (we.session as unknown as { started_at: string })?.started_at

                  return (
                    <div key={we.id} className="rounded-xl border border-border bg-card px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{sessionDate ? formatDate(sessionDate) : '—'}</p>
                        <p className="text-xs text-muted-foreground">{workingSets.length} working sets</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{displayLoad}{unit}</p>
                        <p className="text-xs text-muted-foreground">{reps.join('/')} reps</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </>
  )
}
