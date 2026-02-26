import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { resetPassword } from '@/hooks/useAuth'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await resetPassword(email)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
        <div className="rounded-2xl bg-emerald-500/10 p-4 mb-6">
          <Dumbbell className="h-10 w-10 text-emerald-400 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Check your email</h2>
        <p className="text-muted-foreground max-w-xs">
          We sent a password reset link to <strong>{email}</strong>. Click the link to set a new password.
        </p>
        <Button variant="ghost" className="mt-6" asChild>
          <Link to="/login">Back to sign in</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="rounded-2xl bg-primary p-2.5">
          <Dumbbell className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Gym Bro</h1>
          <p className="text-xs text-muted-foreground">Progressive Overload</p>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-1">Forgot password?</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Enter your email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Email</label>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 text-destructive text-sm px-3 py-2">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-primary font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
