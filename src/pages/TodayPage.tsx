import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { Play, Clock, Dumbbell, ChevronRight } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { useTemplates } from '@/hooks/useTemplates'
import { useSessions } from '@/hooks/useSessions'
import { useActiveWorkout } from '@/store/activeWorkout'
import { formatRelative, formatDuration } from '@/lib/utils'

export function TodayPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: templates, isLoading: templatesLoading } = useTemplates(user?.id)
  const { data: sessions, isLoading: sessionsLoading } = useSessions(user?.id, 5)
  const workout = useActiveWorkout((s) => s.workout)

  const today = format(new Date(), 'EEEE, MMMM d')
  const greeting = getGreeting()

  return (
    <>
      <TopBar
        title="APEX"
        rightAction={
          <Button size="sm" variant="ghost" onClick={() => navigate('/settings')}>
            {user?.email?.split('@')[0] ?? 'You'}
          </Button>
        }
      />
      <PageContainer>
        <div className="py-4 space-y-6">
          {/* Greeting */}
          <div>
            <p className="text-muted-foreground text-sm">{today}</p>
            <h2 className="text-2xl font-bold mt-0.5">{greeting} 💪</h2>
          </div>

          {/* Active workout banner */}
          {workout && (
            <div
              className="rounded-xl bg-primary/10 border border-primary/20 p-4 flex items-center gap-3 cursor-pointer"
              onClick={() => navigate('/workout/active')}
            >
              <div className="rounded-full bg-primary/20 p-2">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{workout.name}</p>
                <p className="text-sm text-muted-foreground">Workout in progress</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          )}

          {/* Templates */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Your Templates</h3>
              <Button size="sm" variant="ghost" onClick={() => navigate('/templates')}>
                See all
              </Button>
            </div>

            {templatesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : templates?.length === 0 ? (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-muted-foreground text-sm mb-3">No templates yet</p>
                  <Button size="sm" onClick={() => navigate('/templates')}>
                    Create your first template
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {(templates ?? []).slice(0, 3).map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => navigate(`/workout/start?template=${template.id}`)}
                  >
                    <CardContent className="flex items-center gap-3 py-4">
                      <div className="rounded-lg bg-primary/10 p-2.5">
                        <Dumbbell className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{template.name}</p>
                        {template.description && (
                          <p className="text-sm text-muted-foreground truncate">{template.description}</p>
                        )}
                      </div>
                      <Button size="sm" variant="ghost" className="shrink-0 gap-1 text-primary">
                        <Play className="h-4 w-4" />
                        Start
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Recent sessions */}
          {sessions && sessions.length > 0 && (
            <section>
              <h3 className="font-semibold mb-3">Recent Workouts</h3>
              <div className="space-y-2">
                {sessions.slice(0, 3).map((session) => (
                  <Card
                    key={session.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => navigate(`/sessions/${session.id}`)}
                  >
                    <CardContent className="flex items-center gap-3 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{session.name ?? 'Workout'}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatRelative(session.started_at)}
                          {session.duration_seconds && ` · ${formatDuration(session.duration_seconds)}`}
                        </p>
                      </div>
                      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Quick start ad-hoc */}
          <div className="pt-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/workout/start')}
            >
              <Play className="h-4 w-4 mr-2" />
              Start empty workout
            </Button>
          </div>
        </div>
      </PageContainer>
    </>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
