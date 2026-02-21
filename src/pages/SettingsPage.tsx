import { useNavigate } from 'react-router-dom'
import { LogOut, Moon, Sun, Monitor } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth, signOut } from '@/hooks/useAuth'
import { useSettings, useUpdateSettings } from '@/hooks/useProfile'
import { AGGRESSIVENESS_LABELS } from '@/lib/constants'

export function SettingsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: settings, isLoading } = useSettings(user?.id)
  const updateSettings = useUpdateSettings(user?.id)

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  function update<K extends keyof NonNullable<typeof settings>>(key: K, value: NonNullable<typeof settings>[K]) {
    updateSettings.mutate({ [key]: value } as any)
  }

  if (isLoading) {
    return (
      <>
        <TopBar title="Settings" />
        <PageContainer>
          <div className="space-y-4 py-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </PageContainer>
      </>
    )
  }

  return (
    <>
      <TopBar title="Settings" />
      <PageContainer>
        <div className="py-4 space-y-6">
          {/* Account */}
          <section>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Account</h2>
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              <div className="px-4 py-3">
                <p className="text-sm text-muted-foreground">Signed in as</p>
                <p className="font-medium truncate">{user?.email}</p>
              </div>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-accent/50 rounded-b-xl"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Sign out</span>
              </button>
            </div>
          </section>

          {/* Preferences */}
          <section>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Preferences</h2>
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {/* Units */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Weight units</p>
                  <p className="text-xs text-muted-foreground">Used across all exercises</p>
                </div>
                <div className="flex rounded-lg border border-border overflow-hidden">
                  {(['kg', 'lbs'] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => update('unit_system', u)}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        settings?.unit_system === u
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Theme</p>
                </div>
                <div className="flex rounded-lg border border-border overflow-hidden">
                  {[
                    { value: 'dark', Icon: Moon },
                    { value: 'system', Icon: Monitor },
                    { value: 'light', Icon: Sun },
                  ].map(({ value, Icon }) => (
                    <button
                      key={value}
                      onClick={() => update('theme', value as any)}
                      className={`p-2 transition-colors ${
                        settings?.theme === value
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Rest timer */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Rest timer</p>
                  <p className="text-xs text-muted-foreground">Auto-start after completing a set</p>
                </div>
                <Switch
                  checked={settings?.rest_timer_enabled ?? true}
                  onCheckedChange={(v) => update('rest_timer_enabled', v)}
                />
              </div>

              {/* Default rest */}
              <div className="px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-sm">Default rest time</p>
                  <p className="text-sm text-muted-foreground">{settings?.default_rest_seconds ?? 120}s</p>
                </div>
                <Slider
                  min={30}
                  max={300}
                  step={15}
                  value={[settings?.default_rest_seconds ?? 120]}
                  onValueChange={([v]) => update('default_rest_seconds', v)}
                />
              </div>
            </div>
          </section>

          {/* Progression */}
          <section>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Progression</h2>
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {/* Aggressiveness */}
              <div className="px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-sm">Progression style</p>
                  <p className="text-sm text-muted-foreground">
                    {AGGRESSIVENESS_LABELS[(settings?.aggressiveness ?? 2) as 1 | 2 | 3]}
                  </p>
                </div>
                <Slider
                  min={1}
                  max={3}
                  step={1}
                  value={[settings?.aggressiveness ?? 2]}
                  onValueChange={([v]) => update('aggressiveness', v as any)}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground">Conservative</span>
                  <span className="text-[10px] text-muted-foreground">Aggressive</span>
                </div>
              </div>

              {/* Deload */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Auto-deload</p>
                  <p className="text-xs text-muted-foreground">Reduce load after multiple missed sessions</p>
                </div>
                <Switch
                  checked={settings?.auto_deload_enabled ?? true}
                  onCheckedChange={(v) => update('auto_deload_enabled', v)}
                />
              </div>

              {/* Plateau threshold */}
              <div className="px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-sm">Plateau threshold</p>
                  <p className="text-sm text-muted-foreground">{settings?.plateau_threshold ?? 3} sessions</p>
                </div>
                <Slider
                  min={2}
                  max={6}
                  step={1}
                  value={[settings?.plateau_threshold ?? 3]}
                  onValueChange={([v]) => update('plateau_threshold', v)}
                />
              </div>
            </div>
          </section>

          <p className="text-center text-xs text-muted-foreground">Gym Bro v0.1.0</p>
        </div>
      </PageContainer>
    </>
  )
}
