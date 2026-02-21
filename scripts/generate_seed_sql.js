#!/usr/bin/env node
/**
 * Reads src/data/exercises_seed.json and generates
 * supabase/migrations/00011_exercises_data.sql
 *
 * Run: node scripts/generate_seed_sql.js
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

const seedData = JSON.parse(
  readFileSync(join(rootDir, 'src', 'data', 'exercises_seed.json'), 'utf-8')
)

function pgArray(arr) {
  if (!arr || arr.length === 0) return "ARRAY[]::text[]"
  return `ARRAY[${arr.map((s) => `'${s.replace(/'/g, "''")}'`).join(',')}]`
}

function pgRange(range) {
  if (!range || !Array.isArray(range)) return "NULL"
  return `'[${range[0]},${range[1]}]'::int4range`
}

function pgBool(val) {
  return val ? 'true' : 'false'
}

function pgStr(val) {
  if (val === null || val === undefined) return 'NULL'
  return `'${String(val).replace(/'/g, "''")}'`
}

const rows = seedData.exercises.map((ex) => {
  return `  (
    ${pgStr(ex.name)},
    ${pgArray(ex.aliases)},
    ${pgArray(ex.primary_muscles)},
    ${pgArray(ex.secondary_muscles)},
    ${pgStr(ex.equipment)},
    ${pgStr(ex.movement_pattern)},
    ${pgStr(ex.force_type)},
    ${pgStr(ex.mechanics)},
    ${pgBool(ex.supports_bodyweight)},
    ${pgBool(ex.supports_incline)},
    ${pgBool(ex.supports_grip)},
    ${pgBool(ex.supports_stance)},
    ${pgRange(ex.default_rep_range)},
    ${ex.default_sets ?? 3},
    ${pgArray(ex.tags)},
    false,
    NULL
  )`
})

const sql = `-- Auto-generated from src/data/exercises_seed.json
-- Run: node scripts/generate_seed_sql.js
-- Safe to re-run: ON CONFLICT DO NOTHING

INSERT INTO public.exercises (
  name,
  aliases,
  primary_muscles,
  secondary_muscles,
  equipment,
  movement_pattern,
  force_type,
  mechanics,
  supports_bodyweight,
  supports_incline,
  supports_grip,
  supports_stance,
  default_rep_range,
  default_sets,
  tags,
  is_custom,
  created_by
) VALUES
${rows.join(',\n')}
ON CONFLICT (name) WHERE is_custom = false DO NOTHING;

-- Verify count
DO $$
DECLARE
  ex_count int;
BEGIN
  SELECT count(*) INTO ex_count FROM public.exercises WHERE is_custom = false;
  RAISE NOTICE 'System exercises in DB: %', ex_count;
END;
$$;
`

const outputPath = join(rootDir, 'supabase', 'migrations', '00011_exercises_data.sql')
writeFileSync(outputPath, sql, 'utf-8')

console.log(`✓ Generated ${seedData.exercises.length} exercises → ${outputPath}`)
