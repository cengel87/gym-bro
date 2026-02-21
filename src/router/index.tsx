import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { BottomNav } from '@/components/layout/BottomNav'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'
import { TodayPage } from '@/pages/TodayPage'
import { ActiveWorkoutPage } from '@/pages/ActiveWorkoutPage'
import { WorkoutStartPage } from '@/pages/WorkoutStartPage'
import { TemplatesPage } from '@/pages/TemplatesPage'
import { TemplateBuilderPage } from '@/pages/TemplateBuilderPage'
import { ProgressPage } from '@/pages/ProgressPage'
import { LibraryPage } from '@/pages/LibraryPage'
import { ExerciseDetailPage } from '@/pages/ExerciseDetailPage'
import { SettingsPage } from '@/pages/SettingsPage'

export function AppRouter() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <TodayPage />
            </AuthGuard>
          }
        />
        <Route
          path="/workout/start"
          element={
            <AuthGuard>
              <WorkoutStartPage />
            </AuthGuard>
          }
        />
        <Route
          path="/workout/active"
          element={
            <AuthGuard>
              <ActiveWorkoutPage />
            </AuthGuard>
          }
        />
        <Route
          path="/templates"
          element={
            <AuthGuard>
              <TemplatesPage />
            </AuthGuard>
          }
        />
        <Route
          path="/templates/:id"
          element={
            <AuthGuard>
              <TemplateBuilderPage />
            </AuthGuard>
          }
        />
        <Route
          path="/progress"
          element={
            <AuthGuard>
              <ProgressPage />
            </AuthGuard>
          }
        />
        <Route
          path="/library"
          element={
            <AuthGuard>
              <LibraryPage />
            </AuthGuard>
          }
        />
        <Route
          path="/library/:id"
          element={
            <AuthGuard>
              <ExerciseDetailPage />
            </AuthGuard>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthGuard>
              <SettingsPage />
            </AuthGuard>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </>
  )
}
