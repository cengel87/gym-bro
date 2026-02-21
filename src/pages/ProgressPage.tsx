import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { PageContainer } from '@/components/layout/PageContainer'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { useSettings } from '@/hooks/useProfile'
import { useBodyweightHistory } from '@/hooks/useBodyweight'
import { useWeeklyVolume, useWorkoutConsistency } from '@/hooks/useProgressData'
import { formatDate } from '@/lib/utils'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

export function ProgressPage() {
  const { user } = useAuth()
  const { data: settings } = useSettings(user?.id)
  const { data: bodyweight, isLoading: bwLoading } = useBodyweightHistory(user?.id, 90)
  const { data: weeklyVolume, isLoading: volLoading } = useWeeklyVolume(user?.id)
  const { data: consistency } = useWorkoutConsistency(user?.id)

  const unit = (settings?.unit_system ?? 'kg') as 'kg' | 'lbs'

  const bwChartData = (bodyweight ?? []).slice().reverse().map((entry) => ({
    date: formatDate(entry.measured_at),
    weight: unit === 'lbs' ? Math.round(Number(entry.weight_kg) * 2.20462 * 10) / 10 : Number(entry.weight_kg),
  }))

  // Group weekly volume by week
  const volMap = new Map<string, number>()
  ;(weeklyVolume ?? []).forEach((v) => {
    const key = v.week_start
    volMap.set(key, (volMap.get(key) ?? 0) + Number(v.total_volume_kg))
  })
  const volData = Array.from(volMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-12)
    .map(([date, vol]) => ({
      date: formatDate(date),
      volume: unit === 'lbs' ? Math.round(vol * 2.20462) : Math.round(vol),
    }))

  // Consistency: count workouts per week in last 90 days
  const weekCounts = new Map<string, number>()
  ;(consistency ?? []).forEach((dateStr) => {
    const d = new Date(dateStr)
    const weekStart = new Date(d)
    weekStart.setDate(d.getDate() - d.getDay())
    const key = weekStart.toISOString().slice(0, 10)
    weekCounts.set(key, (weekCounts.get(key) ?? 0) + 1)
  })
  const consistencyData = Array.from(weekCounts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date: formatDate(date), workouts: count }))

  const totalWorkouts = consistency?.length ?? 0
  const avgPerWeek = consistencyData.length > 0
    ? (consistencyData.reduce((sum, d) => sum + d.workouts, 0) / consistencyData.length).toFixed(1)
    : '0'

  return (
    <>
      <TopBar title="Progress" />
      <PageContainer>
        <div className="py-4 space-y-4">
          {/* Stats overview */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="py-4 text-center">
                <p className="text-3xl font-bold">{totalWorkouts}</p>
                <p className="text-xs text-muted-foreground mt-1">Workouts (90 days)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 text-center">
                <p className="text-3xl font-bold">{avgPerWeek}</p>
                <p className="text-xs text-muted-foreground mt-1">Avg per week</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="volume">
            <TabsList className="w-full">
              <TabsTrigger value="volume" className="flex-1">Volume</TabsTrigger>
              <TabsTrigger value="bodyweight" className="flex-1">Bodyweight</TabsTrigger>
              <TabsTrigger value="consistency" className="flex-1">Consistency</TabsTrigger>
            </TabsList>

            <TabsContent value="volume">
              <Card className="mt-3">
                <CardHeader>
                  <CardTitle className="text-sm">Weekly Volume ({unit})</CardTitle>
                </CardHeader>
                <CardContent>
                  {volLoading ? (
                    <Skeleton className="h-48 w-full" />
                  ) : volData.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No data yet — complete some workouts first</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={volData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                        <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bodyweight">
              <Card className="mt-3">
                <CardHeader>
                  <CardTitle className="text-sm">Bodyweight ({unit})</CardTitle>
                </CardHeader>
                <CardContent>
                  {bwLoading ? (
                    <Skeleton className="h-48 w-full" />
                  ) : bwChartData.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No bodyweight entries yet</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={bwChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" unit={unit} domain={['auto', 'auto']} />
                        <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                        <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="consistency">
              <Card className="mt-3">
                <CardHeader>
                  <CardTitle className="text-sm">Workouts per Week</CardTitle>
                </CardHeader>
                <CardContent>
                  {consistencyData.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={consistencyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                        <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                        <Bar dataKey="workouts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </>
  )
}
