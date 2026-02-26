-- Additional exercises: cable, rings, kettlebell, band, and misc gaps
-- Safe to re-run: ON CONFLICT DO NOTHING

INSERT INTO public.exercises (
  name, aliases, primary_muscles, secondary_muscles,
  equipment, movement_pattern, force_type, mechanics,
  supports_bodyweight, supports_incline, supports_grip, supports_stance,
  default_rep_range, default_sets, tags, is_custom, created_by
) VALUES

-- ═══════════════════════════════════════════════════════════════════════════
-- CABLE
-- ═══════════════════════════════════════════════════════════════════════════

  (
    'Cable Crossover',
    ARRAY['Cable Cross', 'Standing Cable Flye'],
    ARRAY['chest'],
    ARRAY['anterior_deltoid', 'biceps'],
    'cable', 'push_horizontal', 'push', 'isolation',
    false, true, false, false,
    '[10,15]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),
  (
    'Cable Woodchop',
    ARRAY['Wood Chop', 'Cable Chop'],
    ARRAY['core', 'abs'],
    ARRAY['shoulders', 'glutes'],
    'cable', 'core', 'pull', 'compound',
    false, false, false, false,
    '[10,15]'::int4range, 3,
    ARRAY['core', 'functional'],
    false, NULL
  ),
  (
    'Cable Reverse Flye',
    ARRAY['Cable Rear Delt Flye', 'Reverse Cable Flye'],
    ARRAY['rear_deltoid'],
    ARRAY['traps', 'back'],
    'cable', 'pull_horizontal', 'pull', 'isolation',
    false, false, false, false,
    '[12,20]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation', 'shoulder_health'],
    false, NULL
  ),
  (
    'Cable Front Raise',
    ARRAY['Cable Anterior Raise'],
    ARRAY['anterior_deltoid'],
    ARRAY['lateral_deltoid'],
    'cable', 'push_vertical', 'push', 'isolation',
    false, false, false, false,
    '[12,15]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),
  (
    'Cable Upright Row',
    ARRAY[]::text[],
    ARRAY['lateral_deltoid', 'traps'],
    ARRAY['biceps', 'anterior_deltoid'],
    'cable', 'pull_vertical', 'pull', 'compound',
    false, false, true, false,
    '[10,15]'::int4range, 3,
    ARRAY['hypertrophy'],
    false, NULL
  ),
  (
    'Cable Tricep Kickback',
    ARRAY['Cable Kickback'],
    ARRAY['triceps'],
    ARRAY[]::text[],
    'cable', 'isolation', 'push', 'isolation',
    false, false, false, false,
    '[12,15]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),
  (
    'Cable Hammer Curl',
    ARRAY['Rope Hammer Curl'],
    ARRAY['biceps', 'forearms'],
    ARRAY[]::text[],
    'cable', 'isolation', 'pull', 'isolation',
    false, false, true, false,
    '[10,15]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),
  (
    'Cable Pull-Through',
    ARRAY['Pull Through'],
    ARRAY['glutes', 'hamstrings'],
    ARRAY['erectors'],
    'cable', 'hinge', 'pull', 'compound',
    false, false, false, false,
    '[10,15]'::int4range, 3,
    ARRAY['hypertrophy', 'glute_activation'],
    false, NULL
  ),
  (
    'Cable Hip Abduction',
    ARRAY['Standing Cable Abduction'],
    ARRAY['abductors', 'glutes'],
    ARRAY[]::text[],
    'cable', 'isolation', 'push', 'isolation',
    false, false, false, false,
    '[12,20]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation', 'unilateral'],
    false, NULL
  ),
  (
    'Cable Reverse Curl',
    ARRAY[]::text[],
    ARRAY['forearms', 'biceps'],
    ARRAY[]::text[],
    'cable', 'isolation', 'pull', 'isolation',
    false, false, false, false,
    '[12,15]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),
  (
    'Cable Shrug',
    ARRAY[]::text[],
    ARRAY['traps'],
    ARRAY['shoulders'],
    'cable', 'isolation', 'pull', 'isolation',
    false, false, false, false,
    '[10,15]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),
  (
    'Cable Wrist Curl',
    ARRAY[]::text[],
    ARRAY['forearms'],
    ARRAY[]::text[],
    'cable', 'isolation', 'pull', 'isolation',
    false, false, false, false,
    '[15,20]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),
  (
    'Cable External Rotation',
    ARRAY['Cable ER'],
    ARRAY['rear_deltoid'],
    ARRAY['shoulders'],
    'cable', 'isolation', 'pull', 'isolation',
    false, false, false, false,
    '[15,20]'::int4range, 3,
    ARRAY['prehab', 'shoulder_health'],
    false, NULL
  ),
  (
    'Cable Internal Rotation',
    ARRAY['Cable IR'],
    ARRAY['anterior_deltoid'],
    ARRAY['shoulders'],
    'cable', 'isolation', 'push', 'isolation',
    false, false, false, false,
    '[15,20]'::int4range, 3,
    ARRAY['prehab', 'shoulder_health'],
    false, NULL
  ),
  (
    'Single-Arm Cable Chest Flye',
    ARRAY['One-Arm Cable Flye'],
    ARRAY['chest'],
    ARRAY['anterior_deltoid'],
    'cable', 'push_horizontal', 'push', 'isolation',
    false, true, false, false,
    '[10,15]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation', 'unilateral'],
    false, NULL
  ),
  (
    'Cable Bayesian Curl',
    ARRAY['Bayesian Curl'],
    ARRAY['biceps'],
    ARRAY[]::text[],
    'cable', 'isolation', 'pull', 'isolation',
    false, false, false, false,
    '[10,15]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),

-- ═══════════════════════════════════════════════════════════════════════════
-- RINGS (bodyweight equipment)
-- ═══════════════════════════════════════════════════════════════════════════

  (
    'Ring Dip',
    ARRAY['Rings Dip', 'Gymnastic Ring Dip'],
    ARRAY['chest', 'triceps'],
    ARRAY['anterior_deltoid', 'core'],
    'bodyweight', 'push_horizontal', 'push', 'compound',
    true, false, false, false,
    '[5,12]'::int4range, 3,
    ARRAY['calisthenics', 'strength', 'rings'],
    false, NULL
  ),
  (
    'Ring Push-Up',
    ARRAY['Rings Push-Up'],
    ARRAY['chest', 'triceps'],
    ARRAY['anterior_deltoid', 'core'],
    'bodyweight', 'push_horizontal', 'push', 'compound',
    true, false, false, false,
    '[8,15]'::int4range, 3,
    ARRAY['calisthenics', 'rings'],
    false, NULL
  ),
  (
    'Ring Row',
    ARRAY['Ring Inverted Row', 'Rings Row'],
    ARRAY['back', 'lats'],
    ARRAY['biceps', 'rear_deltoid', 'core'],
    'bodyweight', 'pull_horizontal', 'pull', 'compound',
    true, false, true, false,
    '[8,15]'::int4range, 3,
    ARRAY['calisthenics', 'rings'],
    false, NULL
  ),
  (
    'Ring Muscle-Up',
    ARRAY['Rings Muscle-Up'],
    ARRAY['lats', 'chest', 'triceps'],
    ARRAY['biceps', 'core', 'anterior_deltoid'],
    'bodyweight', 'pull_vertical', 'pull', 'compound',
    true, false, false, false,
    '[1,5]'::int4range, 3,
    ARRAY['calisthenics', 'strength', 'rings', 'advanced'],
    false, NULL
  ),
  (
    'Ring Face Pull',
    ARRAY['Rings Face Pull'],
    ARRAY['rear_deltoid', 'traps'],
    ARRAY['biceps', 'back'],
    'bodyweight', 'pull_horizontal', 'pull', 'compound',
    true, false, false, false,
    '[10,15]'::int4range, 3,
    ARRAY['calisthenics', 'rings', 'shoulder_health'],
    false, NULL
  ),
  (
    'Ring L-Sit',
    ARRAY['Rings L-Sit'],
    ARRAY['abs', 'hip_flexors'],
    ARRAY['triceps', 'core'],
    'bodyweight', 'core', 'static', 'compound',
    true, false, false, false,
    '[5,10]'::int4range, 3,
    ARRAY['calisthenics', 'rings', 'isometric'],
    false, NULL
  ),
  (
    'Ring Flye',
    ARRAY['Rings Flye', 'Ring Chest Flye'],
    ARRAY['chest'],
    ARRAY['anterior_deltoid', 'biceps', 'core'],
    'bodyweight', 'push_horizontal', 'push', 'isolation',
    true, false, false, false,
    '[6,12]'::int4range, 3,
    ARRAY['calisthenics', 'rings', 'advanced'],
    false, NULL
  ),
  (
    'Ring Rollout',
    ARRAY['Rings Ab Rollout'],
    ARRAY['abs', 'core'],
    ARRAY['lats', 'triceps'],
    'bodyweight', 'core', 'push', 'compound',
    true, false, false, false,
    '[6,12]'::int4range, 3,
    ARRAY['calisthenics', 'rings', 'core'],
    false, NULL
  ),
  (
    'Ring Tricep Extension',
    ARRAY['Ring Skull Crusher', 'Rings Tricep Extension'],
    ARRAY['triceps'],
    ARRAY['core'],
    'bodyweight', 'isolation', 'push', 'isolation',
    true, false, false, false,
    '[8,15]'::int4range, 3,
    ARRAY['calisthenics', 'rings'],
    false, NULL
  ),
  (
    'Ring Curl',
    ARRAY['Ring Bicep Curl', 'Rings Curl'],
    ARRAY['biceps'],
    ARRAY['forearms', 'core'],
    'bodyweight', 'isolation', 'pull', 'isolation',
    true, false, false, false,
    '[8,15]'::int4range, 3,
    ARRAY['calisthenics', 'rings'],
    false, NULL
  ),
  (
    'Ring Pike Push-Up',
    ARRAY['Rings Pike Press'],
    ARRAY['shoulders', 'anterior_deltoid'],
    ARRAY['triceps', 'core'],
    'bodyweight', 'push_vertical', 'push', 'compound',
    true, false, false, false,
    '[5,10]'::int4range, 3,
    ARRAY['calisthenics', 'rings'],
    false, NULL
  ),
  (
    'Ring Archer Push-Up',
    ARRAY['Rings Archer Push-Up'],
    ARRAY['chest', 'triceps'],
    ARRAY['anterior_deltoid', 'core'],
    'bodyweight', 'push_horizontal', 'push', 'compound',
    true, false, false, false,
    '[4,8]'::int4range, 3,
    ARRAY['calisthenics', 'rings', 'advanced', 'unilateral'],
    false, NULL
  ),

-- ═══════════════════════════════════════════════════════════════════════════
-- KETTLEBELL
-- ═══════════════════════════════════════════════════════════════════════════

  (
    'Turkish Get-Up',
    ARRAY['TGU', 'Kettlebell Get-Up'],
    ARRAY['shoulders', 'core', 'glutes'],
    ARRAY['triceps', 'hip_flexors', 'quads'],
    'kettlebell', 'core', 'push', 'compound',
    false, false, false, false,
    '[1,3]'::int4range, 3,
    ARRAY['functional', 'strength', 'stability'],
    false, NULL
  ),
  (
    'Kettlebell Clean & Press',
    ARRAY['KB Clean and Press'],
    ARRAY['shoulders', 'glutes'],
    ARRAY['triceps', 'core', 'hamstrings'],
    'kettlebell', 'push_vertical', 'push', 'compound',
    false, false, false, false,
    '[5,8]'::int4range, 3,
    ARRAY['functional', 'strength'],
    false, NULL
  ),
  (
    'Kettlebell Snatch',
    ARRAY['KB Snatch'],
    ARRAY['shoulders', 'glutes', 'hamstrings'],
    ARRAY['core', 'traps', 'forearms'],
    'kettlebell', 'hinge', 'push', 'compound',
    false, false, false, false,
    '[5,10]'::int4range, 3,
    ARRAY['functional', 'power', 'conditioning'],
    false, NULL
  ),
  (
    'Kettlebell Windmill',
    ARRAY['KB Windmill'],
    ARRAY['core', 'shoulders'],
    ARRAY['hamstrings', 'glutes', 'hip_flexors'],
    'kettlebell', 'core', 'static', 'compound',
    false, false, false, false,
    '[5,8]'::int4range, 3,
    ARRAY['functional', 'mobility', 'stability'],
    false, NULL
  ),
  (
    'Kettlebell Row',
    ARRAY['KB Row', 'Single-Arm Kettlebell Row'],
    ARRAY['lats', 'back'],
    ARRAY['biceps', 'rear_deltoid', 'core'],
    'kettlebell', 'pull_horizontal', 'pull', 'compound',
    false, false, false, false,
    '[8,12]'::int4range, 3,
    ARRAY['strength', 'hypertrophy', 'unilateral'],
    false, NULL
  ),
  (
    'Kettlebell Deadlift',
    ARRAY['KB Deadlift'],
    ARRAY['glutes', 'hamstrings'],
    ARRAY['erectors', 'quads', 'forearms'],
    'kettlebell', 'hinge', 'pull', 'compound',
    false, false, false, true,
    '[8,12]'::int4range, 3,
    ARRAY['strength', 'beginner'],
    false, NULL
  ),
  (
    'Kettlebell Goblet Squat',
    ARRAY['KB Goblet Squat'],
    ARRAY['quads', 'glutes'],
    ARRAY['core', 'adductors'],
    'kettlebell', 'squat', 'push', 'compound',
    false, false, false, true,
    '[8,15]'::int4range, 3,
    ARRAY['hypertrophy', 'beginner'],
    false, NULL
  ),
  (
    'Kettlebell Halo',
    ARRAY['KB Halo'],
    ARRAY['shoulders'],
    ARRAY['core', 'triceps'],
    'kettlebell', 'isolation', 'push', 'compound',
    false, false, false, false,
    '[8,12]'::int4range, 3,
    ARRAY['warmup', 'mobility', 'shoulder_health'],
    false, NULL
  ),
  (
    'Kettlebell Thruster',
    ARRAY['KB Thruster'],
    ARRAY['quads', 'glutes', 'shoulders'],
    ARRAY['triceps', 'core'],
    'kettlebell', 'push_vertical', 'push', 'compound',
    false, false, false, false,
    '[8,12]'::int4range, 3,
    ARRAY['functional', 'conditioning'],
    false, NULL
  ),

-- ═══════════════════════════════════════════════════════════════════════════
-- BAND
-- ═══════════════════════════════════════════════════════════════════════════

  (
    'Band Pull-Apart',
    ARRAY['Banded Pull-Apart'],
    ARRAY['rear_deltoid', 'traps'],
    ARRAY['back'],
    'band', 'pull_horizontal', 'pull', 'isolation',
    false, false, false, false,
    '[15,25]'::int4range, 3,
    ARRAY['prehab', 'warmup', 'shoulder_health'],
    false, NULL
  ),
  (
    'Band Face Pull',
    ARRAY['Banded Face Pull'],
    ARRAY['rear_deltoid', 'traps'],
    ARRAY['biceps', 'back'],
    'band', 'pull_horizontal', 'pull', 'compound',
    false, false, false, false,
    '[15,20]'::int4range, 3,
    ARRAY['prehab', 'warmup', 'shoulder_health'],
    false, NULL
  ),
  (
    'Band Good Morning',
    ARRAY['Banded Good Morning'],
    ARRAY['hamstrings', 'glutes'],
    ARRAY['erectors'],
    'band', 'hinge', 'pull', 'compound',
    false, false, false, false,
    '[12,20]'::int4range, 3,
    ARRAY['prehab', 'warmup'],
    false, NULL
  ),
  (
    'Band Lateral Walk',
    ARRAY['Banded Lateral Walk', 'Monster Walk'],
    ARRAY['abductors', 'glutes'],
    ARRAY[]::text[],
    'band', 'isolation', 'push', 'isolation',
    false, false, false, false,
    '[12,20]'::int4range, 3,
    ARRAY['prehab', 'warmup', 'glute_activation'],
    false, NULL
  ),
  (
    'Band Hip Thrust',
    ARRAY['Banded Hip Thrust'],
    ARRAY['glutes'],
    ARRAY['hamstrings'],
    'band', 'hinge', 'push', 'compound',
    false, false, false, false,
    '[12,20]'::int4range, 3,
    ARRAY['glute_activation', 'warmup'],
    false, NULL
  ),
  (
    'Band Dislocate',
    ARRAY['Banded Shoulder Dislocate', 'Band Pass-Through'],
    ARRAY['shoulders'],
    ARRAY['rear_deltoid', 'chest'],
    'band', 'isolation', 'push', 'isolation',
    false, false, false, false,
    '[10,15]'::int4range, 3,
    ARRAY['warmup', 'mobility', 'shoulder_health'],
    false, NULL
  ),
  (
    'Band Tricep Pushdown',
    ARRAY['Banded Pushdown'],
    ARRAY['triceps'],
    ARRAY[]::text[],
    'band', 'isolation', 'push', 'isolation',
    false, false, false, false,
    '[15,25]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),
  (
    'Band Curl',
    ARRAY['Banded Curl'],
    ARRAY['biceps'],
    ARRAY['forearms'],
    'band', 'isolation', 'pull', 'isolation',
    false, false, false, false,
    '[15,25]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),

-- ═══════════════════════════════════════════════════════════════════════════
-- BODYWEIGHT (missing staples)
-- ═══════════════════════════════════════════════════════════════════════════

  (
    'Inverted Row',
    ARRAY['Body Row', 'Australian Pull-Up'],
    ARRAY['back', 'lats'],
    ARRAY['biceps', 'rear_deltoid', 'core'],
    'bodyweight', 'pull_horizontal', 'pull', 'compound',
    true, false, true, false,
    '[8,15]'::int4range, 3,
    ARRAY['calisthenics', 'beginner'],
    false, NULL
  ),
  (
    'Muscle-Up',
    ARRAY['Bar Muscle-Up'],
    ARRAY['lats', 'chest', 'triceps'],
    ARRAY['biceps', 'core', 'anterior_deltoid'],
    'bodyweight', 'pull_vertical', 'pull', 'compound',
    true, false, false, false,
    '[1,5]'::int4range, 3,
    ARRAY['calisthenics', 'strength', 'advanced'],
    false, NULL
  ),
  (
    'Pistol Squat',
    ARRAY['Single-Leg Squat'],
    ARRAY['quads', 'glutes'],
    ARRAY['hamstrings', 'core', 'hip_flexors'],
    'bodyweight', 'squat', 'push', 'compound',
    true, false, false, false,
    '[3,8]'::int4range, 3,
    ARRAY['calisthenics', 'unilateral', 'advanced'],
    false, NULL
  ),
  (
    'Bodyweight Squat',
    ARRAY['Air Squat'],
    ARRAY['quads', 'glutes'],
    ARRAY['hamstrings', 'adductors'],
    'bodyweight', 'squat', 'push', 'compound',
    true, false, false, true,
    '[15,25]'::int4range, 3,
    ARRAY['calisthenics', 'beginner', 'warmup'],
    false, NULL
  ),
  (
    'Step-Up',
    ARRAY['Box Step-Up'],
    ARRAY['quads', 'glutes'],
    ARRAY['hamstrings'],
    'bodyweight', 'squat', 'push', 'compound',
    true, false, false, false,
    '[8,15]'::int4range, 3,
    ARRAY['unilateral', 'beginner'],
    false, NULL
  ),
  (
    'Glute Bridge',
    ARRAY['Floor Hip Thrust'],
    ARRAY['glutes'],
    ARRAY['hamstrings', 'core'],
    'bodyweight', 'hinge', 'push', 'compound',
    true, false, false, false,
    '[12,20]'::int4range, 3,
    ARRAY['glute_activation', 'beginner'],
    false, NULL
  ),
  (
    'Bodyweight Calf Raise',
    ARRAY['Single-Leg Calf Raise'],
    ARRAY['calves'],
    ARRAY[]::text[],
    'bodyweight', 'isolation', 'push', 'isolation',
    true, false, false, false,
    '[15,25]'::int4range, 3,
    ARRAY['calisthenics', 'isolation'],
    false, NULL
  ),
  (
    'Decline Push-Up',
    ARRAY['Feet-Elevated Push-Up'],
    ARRAY['chest', 'anterior_deltoid'],
    ARRAY['triceps', 'core'],
    'bodyweight', 'push_horizontal', 'push', 'compound',
    true, false, false, false,
    '[8,15]'::int4range, 3,
    ARRAY['calisthenics'],
    false, NULL
  ),
  (
    'Pike Push-Up',
    ARRAY['Pike Press'],
    ARRAY['shoulders', 'anterior_deltoid'],
    ARRAY['triceps', 'core'],
    'bodyweight', 'push_vertical', 'push', 'compound',
    true, false, false, false,
    '[6,12]'::int4range, 3,
    ARRAY['calisthenics'],
    false, NULL
  ),
  (
    'Handstand Push-Up',
    ARRAY['HSPU'],
    ARRAY['shoulders', 'anterior_deltoid'],
    ARRAY['triceps', 'traps', 'core'],
    'bodyweight', 'push_vertical', 'push', 'compound',
    true, false, false, false,
    '[3,8]'::int4range, 3,
    ARRAY['calisthenics', 'strength', 'advanced'],
    false, NULL
  ),
  (
    'Bodyweight Lunge',
    ARRAY['Walking Lunge'],
    ARRAY['quads', 'glutes'],
    ARRAY['hamstrings', 'adductors'],
    'bodyweight', 'squat', 'push', 'compound',
    true, false, false, false,
    '[10,15]'::int4range, 3,
    ARRAY['calisthenics', 'beginner', 'unilateral'],
    false, NULL
  ),
  (
    'Box Jump',
    ARRAY['Plyo Box Jump'],
    ARRAY['quads', 'glutes'],
    ARRAY['calves', 'hamstrings'],
    'bodyweight', 'squat', 'push', 'compound',
    true, false, false, false,
    '[3,6]'::int4range, 3,
    ARRAY['plyometric', 'power'],
    false, NULL
  ),
  (
    'Burpee',
    ARRAY[]::text[],
    ARRAY['chest', 'quads'],
    ARRAY['shoulders', 'triceps', 'core', 'glutes'],
    'bodyweight', 'push_horizontal', 'push', 'compound',
    true, false, false, false,
    '[8,15]'::int4range, 3,
    ARRAY['conditioning', 'full_body'],
    false, NULL
  ),
  (
    'Mountain Climber',
    ARRAY[]::text[],
    ARRAY['core', 'hip_flexors'],
    ARRAY['quads', 'shoulders'],
    'bodyweight', 'core', 'push', 'compound',
    true, false, false, false,
    '[15,25]'::int4range, 3,
    ARRAY['conditioning', 'core'],
    false, NULL
  ),
  (
    'Toes-to-Bar',
    ARRAY['TTB', 'Toes to Bar'],
    ARRAY['abs', 'hip_flexors'],
    ARRAY['lats', 'forearms'],
    'bodyweight', 'core', 'pull', 'compound',
    true, false, false, false,
    '[5,12]'::int4range, 3,
    ARRAY['calisthenics', 'core'],
    false, NULL
  ),
  (
    'Hollow Body Hold',
    ARRAY['Hollow Hold'],
    ARRAY['abs', 'core'],
    ARRAY['hip_flexors'],
    'bodyweight', 'core', 'static', 'isolation',
    true, false, false, false,
    '[5,10]'::int4range, 3,
    ARRAY['calisthenics', 'core', 'isometric'],
    false, NULL
  ),
  (
    'Superman Hold',
    ARRAY['Back Extension Hold'],
    ARRAY['erectors'],
    ARRAY['glutes', 'rear_deltoid'],
    'bodyweight', 'core', 'static', 'isolation',
    true, false, false, false,
    '[5,10]'::int4range, 3,
    ARRAY['core', 'prehab'],
    false, NULL
  ),

-- ═══════════════════════════════════════════════════════════════════════════
-- MACHINE (gaps)
-- ═══════════════════════════════════════════════════════════════════════════

  (
    'Reverse Pec Deck',
    ARRAY['Machine Reverse Flye', 'Rear Delt Machine'],
    ARRAY['rear_deltoid'],
    ARRAY['traps', 'back'],
    'machine', 'pull_horizontal', 'pull', 'isolation',
    false, false, false, false,
    '[12,20]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation', 'shoulder_health'],
    false, NULL
  ),
  (
    'Glute Ham Raise',
    ARRAY['GHR', 'GHD Raise'],
    ARRAY['hamstrings', 'glutes'],
    ARRAY['erectors', 'calves'],
    'machine', 'hinge', 'pull', 'compound',
    false, false, false, false,
    '[6,12]'::int4range, 3,
    ARRAY['strength', 'hypertrophy'],
    false, NULL
  ),
  (
    'Back Extension',
    ARRAY['Hyperextension', '45° Back Extension'],
    ARRAY['erectors', 'glutes'],
    ARRAY['hamstrings'],
    'machine', 'hinge', 'pull', 'compound',
    false, false, false, false,
    '[10,15]'::int4range, 3,
    ARRAY['hypertrophy', 'prehab'],
    false, NULL
  ),
  (
    'Leg Press Calf Raise',
    ARRAY['Calf Raise on Leg Press'],
    ARRAY['calves'],
    ARRAY[]::text[],
    'machine', 'isolation', 'push', 'isolation',
    false, false, false, false,
    '[12,20]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),
  (
    'Machine Preacher Curl',
    ARRAY['Preacher Curl Machine'],
    ARRAY['biceps'],
    ARRAY['forearms'],
    'machine', 'isolation', 'pull', 'isolation',
    false, false, false, false,
    '[10,15]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),
  (
    'Machine Tricep Extension',
    ARRAY['Tricep Extension Machine'],
    ARRAY['triceps'],
    ARRAY[]::text[],
    'machine', 'isolation', 'push', 'isolation',
    false, false, false, false,
    '[10,15]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),
  (
    'Smith Machine Squat',
    ARRAY['Smith Squat'],
    ARRAY['quads', 'glutes'],
    ARRAY['hamstrings'],
    'machine', 'squat', 'push', 'compound',
    false, false, false, true,
    '[8,12]'::int4range, 3,
    ARRAY['hypertrophy'],
    false, NULL
  ),
  (
    'Smith Machine Bench Press',
    ARRAY['Smith Bench'],
    ARRAY['chest'],
    ARRAY['triceps', 'anterior_deltoid'],
    'machine', 'push_horizontal', 'push', 'compound',
    false, true, false, false,
    '[8,12]'::int4range, 3,
    ARRAY['hypertrophy'],
    false, NULL
  ),
  (
    'Pendulum Squat',
    ARRAY[]::text[],
    ARRAY['quads'],
    ARRAY['glutes'],
    'machine', 'squat', 'push', 'compound',
    false, false, false, true,
    '[8,15]'::int4range, 3,
    ARRAY['hypertrophy'],
    false, NULL
  ),
  (
    'Sissy Squat',
    ARRAY['Sissy Squat Machine'],
    ARRAY['quads'],
    ARRAY['hip_flexors'],
    'machine', 'squat', 'push', 'isolation',
    false, false, false, false,
    '[8,15]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),

-- ═══════════════════════════════════════════════════════════════════════════
-- DUMBBELL (gaps)
-- ═══════════════════════════════════════════════════════════════════════════

  (
    'Dumbbell Lunge',
    ARRAY['DB Lunge', 'Walking Dumbbell Lunge'],
    ARRAY['quads', 'glutes'],
    ARRAY['hamstrings', 'adductors'],
    'dumbbell', 'squat', 'push', 'compound',
    false, false, false, false,
    '[8,12]'::int4range, 3,
    ARRAY['hypertrophy', 'unilateral'],
    false, NULL
  ),
  (
    'Dumbbell Pullover',
    ARRAY['DB Pullover'],
    ARRAY['lats', 'chest'],
    ARRAY['triceps', 'serratus'],
    'dumbbell', 'pull_vertical', 'pull', 'compound',
    false, false, false, false,
    '[10,15]'::int4range, 3,
    ARRAY['hypertrophy'],
    false, NULL
  ),
  (
    'Dumbbell Flye',
    ARRAY['DB Flye', 'Flat Dumbbell Flye'],
    ARRAY['chest'],
    ARRAY['anterior_deltoid'],
    'dumbbell', 'push_horizontal', 'push', 'isolation',
    false, true, false, false,
    '[10,15]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),
  (
    'Decline Dumbbell Press',
    ARRAY['Decline DB Press'],
    ARRAY['chest'],
    ARRAY['triceps', 'anterior_deltoid'],
    'dumbbell', 'push_horizontal', 'push', 'compound',
    false, false, false, false,
    '[8,12]'::int4range, 3,
    ARRAY['hypertrophy'],
    false, NULL
  ),
  (
    'Dumbbell Floor Press',
    ARRAY['DB Floor Press'],
    ARRAY['chest', 'triceps'],
    ARRAY['anterior_deltoid'],
    'dumbbell', 'push_horizontal', 'push', 'compound',
    false, false, false, false,
    '[8,12]'::int4range, 3,
    ARRAY['strength', 'hypertrophy'],
    false, NULL
  ),
  (
    'Dumbbell Kickback',
    ARRAY['Tricep Kickback', 'DB Kickback'],
    ARRAY['triceps'],
    ARRAY[]::text[],
    'dumbbell', 'isolation', 'push', 'isolation',
    false, false, false, false,
    '[12,15]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),
  (
    'Zottman Curl',
    ARRAY['Zottman Dumbbell Curl'],
    ARRAY['biceps', 'forearms'],
    ARRAY[]::text[],
    'dumbbell', 'isolation', 'pull', 'isolation',
    false, false, false, false,
    '[8,12]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),
  (
    'Spider Curl',
    ARRAY['Incline Spider Curl'],
    ARRAY['biceps'],
    ARRAY[]::text[],
    'dumbbell', 'isolation', 'pull', 'isolation',
    false, false, false, false,
    '[10,15]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),
  (
    'Dumbbell Step-Up',
    ARRAY['DB Step-Up', 'Weighted Step-Up'],
    ARRAY['quads', 'glutes'],
    ARRAY['hamstrings'],
    'dumbbell', 'squat', 'push', 'compound',
    false, false, false, false,
    '[8,12]'::int4range, 3,
    ARRAY['hypertrophy', 'unilateral'],
    false, NULL
  ),
  (
    'Dumbbell Lateral Lunge',
    ARRAY['DB Lateral Lunge', 'Cossack Squat'],
    ARRAY['quads', 'adductors'],
    ARRAY['glutes', 'hamstrings'],
    'dumbbell', 'squat', 'push', 'compound',
    false, false, false, false,
    '[8,12]'::int4range, 3,
    ARRAY['hypertrophy', 'mobility', 'unilateral'],
    false, NULL
  ),

-- ═══════════════════════════════════════════════════════════════════════════
-- BARBELL (gaps)
-- ═══════════════════════════════════════════════════════════════════════════

  (
    'Barbell Lunge',
    ARRAY['BB Lunge'],
    ARRAY['quads', 'glutes'],
    ARRAY['hamstrings', 'adductors', 'core'],
    'barbell', 'squat', 'push', 'compound',
    false, false, false, false,
    '[6,10]'::int4range, 3,
    ARRAY['strength', 'hypertrophy', 'unilateral'],
    false, NULL
  ),
  (
    'Floor Press',
    ARRAY['Barbell Floor Press'],
    ARRAY['chest', 'triceps'],
    ARRAY['anterior_deltoid'],
    'barbell', 'push_horizontal', 'push', 'compound',
    false, false, true, false,
    '[5,8]'::int4range, 3,
    ARRAY['strength', 'powerlifting'],
    false, NULL
  ),
  (
    'Pin Press',
    ARRAY['Rack Press', 'Dead Bench'],
    ARRAY['chest', 'triceps'],
    ARRAY['anterior_deltoid'],
    'barbell', 'push_horizontal', 'push', 'compound',
    false, false, true, false,
    '[3,6]'::int4range, 3,
    ARRAY['strength', 'powerlifting'],
    false, NULL
  ),
  (
    'Rack Pull',
    ARRAY['Block Pull'],
    ARRAY['back', 'glutes', 'hamstrings'],
    ARRAY['traps', 'forearms', 'erectors'],
    'barbell', 'hinge', 'pull', 'compound',
    false, false, true, false,
    '[3,6]'::int4range, 3,
    ARRAY['strength', 'powerlifting'],
    false, NULL
  ),
  (
    'Deficit Deadlift',
    ARRAY[]::text[],
    ARRAY['glutes', 'hamstrings', 'quads'],
    ARRAY['erectors', 'lats', 'forearms'],
    'barbell', 'hinge', 'pull', 'compound',
    false, false, false, true,
    '[3,6]'::int4range, 3,
    ARRAY['strength', 'powerlifting'],
    false, NULL
  ),
  (
    'Snatch-Grip Deadlift',
    ARRAY['Wide-Grip Deadlift'],
    ARRAY['back', 'glutes', 'hamstrings'],
    ARRAY['traps', 'erectors', 'quads'],
    'barbell', 'hinge', 'pull', 'compound',
    false, false, false, true,
    '[3,6]'::int4range, 3,
    ARRAY['strength', 'olympic'],
    false, NULL
  ),
  (
    'Barbell Pullover',
    ARRAY['BB Pullover'],
    ARRAY['lats', 'chest'],
    ARRAY['triceps', 'serratus'],
    'barbell', 'pull_vertical', 'pull', 'compound',
    false, false, false, false,
    '[8,12]'::int4range, 3,
    ARRAY['hypertrophy'],
    false, NULL
  ),
  (
    'Reverse Barbell Curl',
    ARRAY['Reverse Curl'],
    ARRAY['forearms', 'biceps'],
    ARRAY[]::text[],
    'barbell', 'isolation', 'pull', 'isolation',
    false, false, false, false,
    '[10,15]'::int4range, 3,
    ARRAY['hypertrophy', 'isolation'],
    false, NULL
  ),
  (
    'Barbell Hip Thrust',
    ARRAY['BB Hip Thrust'],
    ARRAY['glutes'],
    ARRAY['hamstrings', 'core'],
    'barbell', 'hinge', 'push', 'compound',
    false, false, false, false,
    '[8,12]'::int4range, 3,
    ARRAY['strength', 'hypertrophy', 'glute_activation'],
    false, NULL
  ),
  (
    'Seal Row',
    ARRAY['Chest-Supported Barbell Row'],
    ARRAY['lats', 'back'],
    ARRAY['biceps', 'rear_deltoid'],
    'barbell', 'pull_horizontal', 'pull', 'compound',
    false, false, true, false,
    '[8,12]'::int4range, 3,
    ARRAY['strength', 'hypertrophy'],
    false, NULL
  ),
  (
    'Barbell Hack Squat',
    ARRAY['BB Hack Squat'],
    ARRAY['quads'],
    ARRAY['glutes', 'hamstrings'],
    'barbell', 'squat', 'push', 'compound',
    false, false, false, true,
    '[6,10]'::int4range, 3,
    ARRAY['strength', 'hypertrophy'],
    false, NULL
  )

ON CONFLICT (name) WHERE is_custom = false DO NOTHING;
