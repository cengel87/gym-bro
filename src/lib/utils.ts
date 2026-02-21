import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWeight(kg: number, unit: 'kg' | 'lbs'): string {
  if (unit === 'lbs') {
    return `${Math.round(kg * 2.20462 * 4) / 4}lbs`
  }
  return `${kg}kg`
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 4) / 4
}

export function lbsToKg(lbs: number): number {
  return Math.round((lbs / 2.20462) * 4) / 4
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d')
}

export function formatDateFull(dateStr: string): string {
  return format(new Date(dateStr), 'EEEE, MMM d')
}

export function formatRelative(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ')
}

export function muscleLabel(muscle: string): string {
  const map: Record<string, string> = {
    quads: 'Quadriceps',
    glutes: 'Glutes',
    hamstrings: 'Hamstrings',
    chest: 'Chest',
    triceps: 'Triceps',
    biceps: 'Biceps',
    back: 'Back',
    lats: 'Lats',
    traps: 'Traps',
    shoulders: 'Shoulders',
    anterior_deltoid: 'Front Delt',
    lateral_deltoid: 'Side Delt',
    rear_deltoid: 'Rear Delt',
    core: 'Core',
    abs: 'Abs',
    calves: 'Calves',
    adductors: 'Adductors',
    abductors: 'Abductors',
    erectors: 'Erectors',
    serratus: 'Serratus',
    forearms: 'Forearms',
    hip_flexors: 'Hip Flexors',
    neck: 'Neck',
  }
  return map[muscle] ?? capitalizeFirst(muscle)
}
