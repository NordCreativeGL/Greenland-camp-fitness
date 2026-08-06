const EXERCISES = {
  push: {
    label: 'Push',
    startVariantIndex: 1,
    variants: [
      { name: 'Push-ups (paralletter)', type: 'reps', baseReps: 8, setsTarget: 3, perSide: false },
      { name: 'Diamond/deficit push-ups (paralletter)', type: 'reps', baseReps: 15, setsTarget: 3, perSide: false },
      { name: 'Archer push-ups', type: 'reps', baseReps: 8, setsTarget: 3, perSide: true },
      { name: 'Pseudo planche push-ups', type: 'reps', baseReps: 6, setsTarget: 3, perSide: false }
    ]
  },

  dips: {
    label: 'Dips (ringe)',
    startVariantIndex: 1,
    variants: [
      { name: 'Negative ring dips', type: 'reps', baseReps: 5, setsTarget: 3, perSide: false },
      { name: 'Fulde ring dips', type: 'reps', baseReps: 7, setsTarget: 3, perSide: false },
      { name: 'Deep RTO ring dips', type: 'reps', baseReps: 5, setsTarget: 3, perSide: false },
      { name: 'Bulgarian ring dips', type: 'reps', baseReps: 5, setsTarget: 3, perSide: false }
    ]
  },

  pullRow: {
    label: 'Pull - Row (ringe)',
    startVariantIndex: 1,
    variants: [
      { name: 'Ring rows, fødder på jorden', type: 'reps', baseReps: 10, setsTarget: 3, perSide: false },
      { name: 'Ring rows, krop vandret', type: 'reps', baseReps: 12, setsTarget: 3, perSide: false },
      { name: 'Archer ring rows', type: 'reps', baseReps: 6, setsTarget: 3, perSide: true },
      { name: 'Langsom excentrisk ring row (4s)', type: 'reps', baseReps: 5, setsTarget: 3, perSide: false }
    ]
  },

  pullVertical: {
    label: 'Pull - Pull-up (ringe)',
    startVariantIndex: 1,
    variants: [
      { name: 'Negative ring pull-ups', type: 'reps', baseReps: 5, setsTarget: 3, perSide: false },
      { name: 'Fulde ring pull-ups', type: 'reps', baseReps: 8, setsTarget: 3, perSide: false },
      { name: 'Archer ring pull-ups', type: 'reps', baseReps: 4, setsTarget: 3, perSide: true },
      { name: 'Muscle-up transition-arbejde', type: 'reps', baseReps: 3, setsTarget: 3, perSide: false }
    ]
  },

  legs: {
    label: 'Ben (elastik)',
    variants: [
      { name: 'Elastik-squats', type: 'reps', baseReps: 12, setsTarget: 3, perSide: false },
      { name: 'Bulgarian split squat + elastik', type: 'reps', baseReps: 8, setsTarget: 3, perSide: true },
      { name: 'Elastik-RDL/hip thrust', type: 'reps', baseReps: 10, setsTarget: 3, perSide: false },
      { name: 'Laterale elastik-walks + pistol-forsøg', type: 'reps', baseReps: 8, setsTarget: 3, perSide: true }
    ]
  },

  coreSkill: {
    label: 'Core/Skill',
    startVariantIndex: 1,
    variants: [
      { name: 'Tuck L-sit hold', type: 'hold', baseHoldSeconds: 15, setsTarget: 3, perSide: false },
      { name: 'Fuld L-sit hold', type: 'hold', baseHoldSeconds: 12, setsTarget: 3, perSide: false },
      { name: 'L-sit pull-ups/V-sit hold', type: 'hold', baseHoldSeconds: 8, setsTarget: 3, perSide: false },
      { name: 'Planche lean hold', type: 'hold', baseHoldSeconds: 15, setsTarget: 3, perSide: false }
    ]
  },

  handstand: {
    label: 'Håndstand',
    startVariantIndex: 2,
    variants: [
      { name: 'Væg-håndstand hold', type: 'hold', baseHoldSeconds: 20, setsTarget: 3, perSide: false },
      { name: 'Frit håndstand-forsøg/walk', type: 'hold', baseHoldSeconds: 10, setsTarget: 3, perSide: false },
      { name: 'Negative håndstand push-ups (væg)', type: 'reps', baseReps: 4, setsTarget: 3, perSide: false },
      { name: 'Håndstand push-ups (væg)', type: 'reps', baseReps: 3, setsTarget: 3, perSide: false }
    ]
  },

  conditioning: {
    label: 'Conditioning',
    finishers: ['Burpees', 'Mountain climbers', 'Jumping lunges', 'Bear crawl', 'High knees']
  }
};
