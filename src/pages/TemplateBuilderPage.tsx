import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2, Play, GripVertical, Settings2 } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { VariantSelector } from '@/components/workout/VariantSelector'
import { useTemplate, useAddTemplateExercise, useRemoveTemplateExercise, useUpdateTemplateExercise } from '@/hooks/useTemplates'
import { useExercises } from '@/hooks/useExercises'
import type { Exercise } from '@/types/app.types'

function formatVariant(variantKey: Record<string, unknown>): string | null {
  const parts: string[] = []
  if (variantKey.incline_deg != null) parts.push(`${variantKey.incline_deg}°`)
  if (variantKey.grip) parts.push(String(variantKey.grip))
  if (variantKey.stance) parts.push(String(variantKey.stance))
  return parts.length > 0 ? parts.join(' · ') : null
}

export function TemplateBuilderPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: template, isLoading } = useTemplate(id)
  const addExercise = useAddTemplateExercise()
  const removeExercise = useRemoveTemplateExercise()
  const updateTemplateExercise = useUpdateTemplateExercise()
  const [addOpen, setAddOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { data: exercises } = useExercises({ search })
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null)

  async function handleAdd(exercise: Exercise) {
    if (!id) return
    await addExercise.mutateAsync({
      template_id: id,
      exercise_id: exercise.id,
      sort_order: template?.template_exercises.length ?? 0,
      target_sets: exercise.default_sets,
      min_reps: exercise.default_rep_range ? parseInt(exercise.default_rep_range.replace(/[[\]]/g, '').split(',')[0]) : 8,
      max_reps: exercise.default_rep_range ? parseInt(exercise.default_rep_range.replace(/[[\]]/g, '').split(',')[1]) : 12,
      rest_seconds: 120,
      variant_key: {},
    })
    setAddOpen(false)
    setSearch('')
  }

  if (isLoading) {
    return (
      <>
        <TopBar title="Template" showBack />
        <PageContainer>
          <div className="py-4 space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </PageContainer>
      </>
    )
  }

  return (
    <>
      <TopBar
        title={template?.name ?? 'Template'}
        showBack
        rightAction={
          <Button
            size="sm"
            onClick={() => navigate(`/workout/start?template=${id}`)}
            className="gap-1"
          >
            <Play className="h-4 w-4" />
            Start
          </Button>
        }
      />
      <PageContainer>
        <div className="py-4 space-y-3">
          {template?.description && (
            <p className="text-sm text-muted-foreground">{template.description}</p>
          )}

          {template?.template_exercises.map((te) => {
            const hasModifiers = te.exercise.supports_incline || te.exercise.supports_grip || te.exercise.supports_stance
            const variantKey = (te.variant_key as Record<string, unknown>) ?? {}
            const variantLabel = formatVariant(variantKey)

            return (
              <div key={te.id} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{te.exercise.name}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {te.target_sets} sets
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {te.min_reps}–{te.max_reps} reps
                      </Badge>
                      <span className="text-xs text-muted-foreground capitalize">{te.exercise.equipment}</span>
                      {variantLabel && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {variantLabel}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {hasModifiers && (
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-muted-foreground shrink-0"
                      onClick={() => setEditingVariantId(editingVariantId === te.id ? null : te.id)}
                    >
                      <Settings2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="text-muted-foreground shrink-0"
                    onClick={() => removeExercise.mutate({ id: te.id, templateId: id! })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {editingVariantId === te.id && hasModifiers && (
                  <div className="px-4 pb-4">
                    <VariantSelector
                      exercise={te.exercise}
                      variantKey={variantKey}
                      onChange={(vk) => {
                        updateTemplateExercise.mutate({
                          id: te.id,
                          templateId: id!,
                          updates: { variant_key: vk },
                        })
                        setEditingVariantId(null)
                      }}
                      onClose={() => setEditingVariantId(null)}
                    />
                  </div>
                )}
              </div>
            )
          })}

          <Button variant="outline" className="w-full" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add exercise
          </Button>
        </div>
      </PageContainer>

      <Sheet open={addOpen} onOpenChange={(o) => { if (!o) { setAddOpen(false); setSearch('') } }}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Add Exercise</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4 space-y-3">
            <input
              type="text"
              placeholder="Search exercises…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
            <div className="max-h-[55vh] overflow-y-auto space-y-1">
              {(exercises ?? []).slice(0, 30).map((ex) => (
                <button
                  key={ex.id}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent text-left tap-highlight-none"
                  onClick={() => handleAdd(ex)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{ex.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {ex.equipment} · {ex.primary_muscles.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
