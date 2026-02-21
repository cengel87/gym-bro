import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { PageContainer } from '@/components/layout/PageContainer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useExercises } from '@/hooks/useExercises'
import { EQUIPMENT_LIST, MUSCLE_GROUPS, MOVEMENT_PATTERNS } from '@/lib/constants'
import { capitalizeFirst, muscleLabel } from '@/lib/utils'

export function LibraryPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [equipment, setEquipment] = useState('')
  const [muscle, setMuscle] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)

  const { data: exercises, isLoading } = useExercises({ search, equipment, muscle })

  const activeFilters = [equipment, muscle].filter(Boolean).length

  return (
    <>
      <TopBar title="Exercise Library" />
      <PageContainer noPadding>
        {/* Search + filter bar */}
        <div className="sticky top-[57px] z-20 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-3 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant={activeFilters > 0 ? 'default' : 'outline'}
            size="icon"
            onClick={() => setFilterOpen(true)}
          >
            <Filter className="h-4 w-4" />
            {activeFilters > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] flex items-center justify-center text-primary-foreground">
                {activeFilters}
              </span>
            )}
          </Button>
        </div>

        {/* Active filters */}
        {activeFilters > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 flex-wrap">
            {equipment && (
              <Badge variant="info" className="cursor-pointer gap-1" onClick={() => setEquipment('')}>
                {capitalizeFirst(equipment)} ×
              </Badge>
            )}
            {muscle && (
              <Badge variant="info" className="cursor-pointer gap-1" onClick={() => setMuscle('')}>
                {muscleLabel(muscle)} ×
              </Badge>
            )}
          </div>
        )}

        {/* Results */}
        <div className="px-4 pb-6">
          {isLoading ? (
            <div className="space-y-2 py-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : exercises?.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">No exercises found</p>
              <Button variant="ghost" className="mt-2" onClick={() => { setSearch(''); setEquipment(''); setMuscle('') }}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="space-y-1 py-3">
              {exercises?.map((ex) => (
                <button
                  key={ex.id}
                  className="w-full flex items-start gap-3 px-3 py-3.5 rounded-xl hover:bg-accent text-left tap-highlight-none"
                  onClick={() => navigate(`/library/${ex.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{ex.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                      {ex.equipment} · {ex.primary_muscles.map(muscleLabel).join(', ')}
                    </p>
                    {ex.tags.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {ex.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </PageContainer>

      {/* Filter sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Filter Exercises</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-8 space-y-5">
            <div>
              <p className="text-sm font-medium mb-2">Equipment</p>
              <div className="flex flex-wrap gap-2">
                {EQUIPMENT_LIST.map((eq) => (
                  <button
                    key={eq}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      equipment === eq
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-muted-foreground'
                    }`}
                    onClick={() => setEquipment(equipment === eq ? '' : eq)}
                  >
                    {capitalizeFirst(eq)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Muscle Group</p>
              <div className="flex flex-wrap gap-2">
                {['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'glutes', 'hamstrings', 'calves', 'core'].map((m) => (
                  <button
                    key={m}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      muscle === m
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-muted-foreground'
                    }`}
                    onClick={() => setMuscle(muscle === m ? '' : m)}
                  >
                    {muscleLabel(m)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setEquipment(''); setMuscle(''); setFilterOpen(false) }}>
                Clear all
              </Button>
              <Button className="flex-1" onClick={() => setFilterOpen(false)}>
                Apply
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
