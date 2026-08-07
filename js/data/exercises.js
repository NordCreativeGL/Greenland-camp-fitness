const EXERCISES = {
  push: {
    label: 'Push',
    primary: {
      name: 'Pseudo Planche Push-up',
      type: 'reps',
      weeks: [
        { sets: 3, reps: 6, tempo: '2011', restSeconds: 60 },
        { sets: 3, reps: 7, tempo: '2011', restSeconds: 60 },
        { sets: 3, reps: 8, tempo: '3011', restSeconds: 60 },
        { sets: 2, reps: 6, tempo: '3011', restSeconds: 60, deload: true },
        { name: 'Feet-Elevated Pseudo Planche Push-up', sets: 3, reps: 5, tempo: '3021', restSeconds: 65 },
        { name: 'Feet-Elevated Pseudo Planche Push-up', sets: 3, reps: 6, tempo: '3021', restSeconds: 55 }
      ]
    },
    secondary: {
      name: 'Pike Push-up',
      type: 'reps',
      weeks: [
        { sets: 2, reps: 8, restSeconds: 45 },
        { sets: 2, reps: 10, restSeconds: 45 },
        { sets: 2, reps: 10, tempo: '3010', restSeconds: 45 },
        { sets: 2, reps: 8, restSeconds: 45, deload: true },
        { name: 'Elevated Pike Push-up', sets: 2, reps: 6, restSeconds: 45 },
        { sets: 2, reps: 8, restSeconds: 40 }
      ]
    }
  },

  pullVertical: {
    label: 'Pull - Pull-up (ringe)',
    primary: {
      name: 'Ring Pull-ups',
      type: 'reps',
      weeks: [
        { sets: 3, reps: 6, tempo: '2011', restSeconds: 60 },
        { sets: 3, reps: 7, tempo: '2011', restSeconds: 60 },
        { sets: 3, reps: 8, tempo: '3011', restSeconds: 60 },
        { sets: 2, reps: 6, tempo: '3011', restSeconds: 60, deload: true },
        { name: 'Archer Pull-ups', sets: 3, reps: 4, perSide: true, tempo: '3021', restSeconds: 65 },
        { name: 'Archer Pull-ups', sets: 3, reps: 5, perSide: true, tempo: '3021', restSeconds: 55 }
      ]
    },
    secondary: {
      name: 'Slow Negative Pull-up',
      type: 'reps',
      weeks: [
        { sets: 2, reps: 4, restSeconds: 45, note: '5s negativ' },
        { sets: 2, reps: 5, restSeconds: 45 },
        { sets: 2, reps: 5, restSeconds: 45, note: '6s negativ' },
        { sets: 2, reps: 4, restSeconds: 45, deload: true },
        { name: 'Negative Pull-up + Top-Pause', sets: 2, reps: 4, restSeconds: 45, note: '6s negativ + top-pause' },
        { sets: 2, reps: 5, restSeconds: 40 }
      ]
    }
  },

  dips: {
    label: 'Dips (ringe)',
    primary: {
      name: 'Ring Dips',
      type: 'reps',
      weeks: [
        { sets: 3, reps: 6, tempo: '2011', restSeconds: 60 },
        { sets: 3, reps: 7, tempo: '2011', restSeconds: 60 },
        { sets: 3, reps: 8, tempo: '3011', restSeconds: 60 },
        { sets: 2, reps: 6, restSeconds: 60, deload: true },
        { name: 'Paused Dips', sets: 3, reps: 5, tempo: '2021', restSeconds: 65 },
        { name: 'Paused Dips', sets: 3, reps: 6, tempo: '2021', restSeconds: 55 }
      ]
    },
    secondary: {
      name: 'Straight-Bar Dips',
      type: 'reps',
      weeks: [
        { sets: 2, reps: 8, restSeconds: 45 },
        { sets: 2, reps: 9, restSeconds: 45 },
        { sets: 2, reps: 10, tempo: '3010', restSeconds: 45 },
        { sets: 2, reps: 8, restSeconds: 45, deload: true },
        { sets: 2, reps: 7, tempo: '3011', restSeconds: 45 },
        { sets: 2, reps: 9, restSeconds: 40 }
      ]
    }
  },

  pullRow: {
    label: 'Pull - Row (ringe)',
    primary: {
      name: 'Feet-Elevated Ring Rows',
      type: 'reps',
      weeks: [
        { sets: 3, reps: 8, tempo: '2011', restSeconds: 60 },
        { sets: 3, reps: 10, tempo: '2011', restSeconds: 60 },
        { sets: 3, reps: 11, tempo: '3011', restSeconds: 60 },
        { sets: 2, reps: 8, restSeconds: 60, deload: true },
        { name: 'Paused Rows', sets: 3, reps: 7, tempo: '2021', restSeconds: 65 },
        { name: 'Paused Rows', sets: 3, reps: 8, tempo: '2021', restSeconds: 55 }
      ]
    },
    secondary: {
      name: 'Elastik Face Pull',
      type: 'reps',
      weeks: [
        { sets: 2, reps: 15, restSeconds: 45 },
        { sets: 2, reps: 15, restSeconds: 45 },
        { sets: 2, reps: 18, restSeconds: 45 },
        { sets: 2, reps: 15, restSeconds: 45, deload: true },
        { sets: 2, reps: 15, restSeconds: 45, note: 'tykkere bånd' },
        { sets: 2, reps: 18, restSeconds: 40 }
      ]
    }
  },

  legsQuad: {
    label: 'Legs (quad)',
    primary: {
      name: 'Elastik Squat',
      type: 'reps',
      weeks: [
        { sets: 5, reps: 15, tempo: '2010', restSeconds: 90, rir: 3, note: 'kalibrér båndtykkelse' },
        { sets: 5, reps: 18, tempo: '2010', restSeconds: 90, rir: '2-3' },
        { sets: 5, reps: 20, tempo: '3010', restSeconds: 90, rir: 2 },
        { sets: 4, reps: 15, tempo: '3010', restSeconds: 90, rir: 3, deload: true },
        { name: 'Bulgarian Split Squat', sets: 5, reps: 10, perSide: true, tempo: '3011', restSeconds: 100, rir: 2 },
        { name: 'Bulgarian Split Squat', sets: 5, reps: 12, perSide: true, tempo: '3011', restSeconds: 90, rir: '1-2' }
      ]
    }
  },

  legsHinge: {
    label: 'Legs (hinge)',
    primary: {
      name: 'Elastik RDL',
      type: 'reps',
      weeks: [
        { sets: 5, reps: 15, tempo: '2010', restSeconds: 90, rir: 3 },
        { sets: 5, reps: 18, tempo: '2010', restSeconds: 90, rir: '2-3' },
        { sets: 5, reps: 20, tempo: '3010', restSeconds: 90, rir: 2 },
        { sets: 4, reps: 15, tempo: '3010', restSeconds: 90, rir: 3, deload: true },
        { name: 'Single-Leg RDL', sets: 5, reps: 10, perSide: true, tempo: '3010', restSeconds: 100, rir: 2 },
        { name: 'Single-Leg RDL', sets: 5, reps: 12, perSide: true, tempo: '3010', restSeconds: 90, rir: '1-2' }
      ]
    }
  },

  handstand: {
    label: 'Håndstand',
    primary: {
      name: 'Væg-håndstand hold',
      type: 'hold',
      weeks: [
        { sets: 5, holdSeconds: 30, restSeconds: 75 },
        { sets: 5, holdSeconds: 35, restSeconds: 75 },
        { sets: 5, holdSeconds: 40, restSeconds: 60 },
        { sets: 4, holdSeconds: 30, restSeconds: 75, deload: true },
        { name: 'Freestanding-forsøg', sets: 5, holdSeconds: '15-20', restSeconds: 100 },
        { name: 'Freestanding-forsøg', sets: 5, holdSeconds: '20-25', restSeconds: 90 }
      ]
    },
    secondary: {
      name: 'Pike/Væg HSPU-negativ',
      type: 'reps',
      weeks: [
        { sets: 2, reps: 4, restSeconds: 90, note: '4s negativ' },
        { sets: 2, reps: 5, restSeconds: 90 },
        { sets: 2, reps: 5, restSeconds: 90, note: '5s negativ' },
        { sets: 2, reps: 4, restSeconds: 90, deload: true },
        { sets: 2, reps: 4, restSeconds: 90, note: '5s negativ, forhøjet' },
        { sets: 2, reps: 5, restSeconds: 75 }
      ]
    }
  },

  coreSkillA: {
    label: 'Core/Skill A',
    primary: {
      name: 'Fuld L-sit',
      type: 'hold',
      weeks: [
        { sets: 5, holdSeconds: 15, restSeconds: 75 },
        { sets: 5, holdSeconds: 18, restSeconds: 75 },
        { sets: 5, holdSeconds: 22, restSeconds: 60 },
        { sets: 4, holdSeconds: 15, restSeconds: 75, deload: true },
        { name: 'Straddle L-sit', sets: 5, holdSeconds: 10, restSeconds: 90 },
        { name: 'Straddle L-sit', sets: 5, holdSeconds: 15, restSeconds: 75 }
      ]
    },
    secondary: {
      name: 'Hollow Body Hold',
      type: 'hold',
      weeks: [
        { sets: 3, holdSeconds: 20, restSeconds: 45 },
        { sets: 3, holdSeconds: 25, restSeconds: 45 },
        { sets: 3, holdSeconds: 30, restSeconds: 45 },
        { sets: 2, holdSeconds: 20, restSeconds: 45, deload: true },
        { sets: 3, holdSeconds: 25, restSeconds: 45 },
        { sets: 3, holdSeconds: 30, restSeconds: 45 }
      ]
    }
  },

  coreSkillB: {
    label: 'Core/Skill B',
    primary: {
      name: 'Dragon Flag Negative',
      type: 'reps',
      weeks: [
        { sets: 4, reps: 5, restSeconds: 90, note: '5s negativ' },
        { sets: 4, reps: 6, restSeconds: 90 },
        { sets: 4, reps: 7, restSeconds: 90 },
        { sets: 3, reps: 5, restSeconds: 90, deload: true },
        { sets: 4, reps: 5, restSeconds: 90, note: '6s negativ' },
        { sets: 4, reps: 6, restSeconds: 75, note: '6s negativ' }
      ]
    },
    secondary: {
      name: 'Toes-to-Rings',
      type: 'reps',
      weeks: [
        { sets: 3, reps: 6, restSeconds: 90 },
        { sets: 3, reps: 7, restSeconds: 90 },
        { sets: 3, reps: 8, restSeconds: 90 },
        { sets: 2, reps: 6, restSeconds: 90, deload: true },
        { sets: 3, reps: 7, restSeconds: 90, note: '3s excentrisk' },
        { sets: 3, reps: 8, restSeconds: 75, note: '3s excentrisk' }
      ]
    }
  },

  conditioning: {
    label: 'Conditioning',
    primary: {
      type: 'circuit',
      weeks: [
        {
          exercises: [
            { name: 'Burpees', rounds: 4, workSeconds: 30, restSeconds: 30 },
            { name: 'Jumping squats', rounds: 4, workSeconds: 30, restSeconds: 30 }
          ]
        },
        {
          exercises: [
            { name: 'Burpees', rounds: 4, workSeconds: 30, restSeconds: 30 },
            { name: 'Jumping squats', rounds: 4, workSeconds: 30, restSeconds: 30 }
          ]
        },
        {
          exercises: [
            { name: 'Burpees', rounds: 4, workSeconds: 30, restSeconds: 30 },
            { name: 'Jumping squats', rounds: 4, workSeconds: 30, restSeconds: 30 }
          ]
        },
        {
          exercises: [
            { name: 'Burpees', rounds: 3, workSeconds: 30, restSeconds: 30 },
            { name: 'Jumping squats', rounds: 3, workSeconds: 30, restSeconds: 30 }
          ],
          deload: true
        },
        {
          exercises: [
            { name: 'Burpees', rounds: 5, workSeconds: 30, restSeconds: 20 },
            { name: 'Jumping squats', rounds: 5, workSeconds: 30, restSeconds: 20 }
          ]
        },
        {
          exercises: [
            { name: 'Burpees', rounds: 5, workSeconds: 30, restSeconds: 20 },
            { name: 'Jumping squats', rounds: 5, workSeconds: 30, restSeconds: 20 }
          ]
        }
      ]
    },
    finisher: {
      label: 'Finisher',
      type: 'circuit',
      durationNote: '5-6 min',
      restNote: 'minimal pause',
      exercises: [
        { name: 'Mountain climbers', sets: 3, workSeconds: 30 },
        { name: 'Burpees', sets: 3, workSeconds: 20 }
      ]
    }
  }
};
