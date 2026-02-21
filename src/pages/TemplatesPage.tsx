import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Play, Edit3, Trash2, Dumbbell } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { useTemplates, useCreateTemplate, useDeleteTemplate } from '@/hooks/useTemplates'

export function TemplatesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: templates, isLoading } = useTemplates(user?.id)
  const createTemplate = useCreateTemplate(user?.id)
  const deleteTemplate = useDeleteTemplate(user?.id)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')

  async function handleCreate() {
    if (!newName.trim()) return
    const { data } = await createTemplate.mutateAsync({ name: newName.trim(), description: newDesc.trim() || undefined })
    setShowCreate(false)
    setNewName('')
    setNewDesc('')
    if (data?.id) navigate(`/templates/${data.id}`)
  }

  return (
    <>
      <TopBar
        title="Templates"
        rightAction={
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        }
      />
      <PageContainer>
        <div className="py-4 space-y-3">
          {isLoading ? (
            <>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </>
          ) : templates?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-2xl bg-muted p-4 mb-4">
                <Dumbbell className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">No templates yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Create a template to plan your workout splits</p>
              <Button onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create template
              </Button>
            </div>
          ) : (
            templates?.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardContent className="flex items-center gap-3 py-4">
                  <div className="rounded-lg bg-primary/10 p-2.5 shrink-0">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/templates/${template.id}`)}>
                    <p className="font-medium truncate">{template.name}</p>
                    {template.description && (
                      <p className="text-sm text-muted-foreground truncate">{template.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => navigate(`/templates/${template.id}`)}
                      className="text-muted-foreground"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1 text-primary"
                      onClick={() => navigate(`/workout/start?template=${template.id}`)}
                    >
                      <Play className="h-4 w-4" />
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </PageContainer>

      {/* Create template sheet */}
      <Sheet open={showCreate} onOpenChange={setShowCreate}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>New Template</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-8 space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium block mb-1.5">Name</label>
              <Input
                placeholder="e.g. Push Day, Legs"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Description (optional)</label>
              <Input
                placeholder="e.g. Chest, shoulders, triceps"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleCreate}
              disabled={!newName.trim() || createTemplate.isPending}
            >
              {createTemplate.isPending ? 'Creating…' : 'Create template'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
