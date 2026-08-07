const WEEKLY_SCHEDULE = [
  {
    dayOfWeek: 1,
    isLightDay: false,
    sessions: {
      morgen: { mode: 'alternating', categories: ['push', 'pullVertical'] },
      middag: { mode: 'single', categories: ['legsQuad'] },
      aften: { mode: 'single', categories: ['handstand'] }
    }
  },
  {
    dayOfWeek: 2,
    isLightDay: false,
    sessions: {
      morgen: { mode: 'alternating', categories: ['dips', 'pullRow'], finisher: 'conditioning' },
      middag: { mode: 'single', categories: ['coreSkillA'] },
      aften: { mode: 'single', categories: ['legsHinge'] }
    }
  },
  {
    dayOfWeek: 3,
    isLightDay: false,
    sessions: {
      morgen: { mode: 'single', categories: ['legsQuad'] },
      middag: { mode: 'single', categories: ['handstand'] },
      aften: { mode: 'single', categories: ['conditioning'] }
    }
  },
  {
    dayOfWeek: 4,
    isLightDay: false,
    sessions: {
      morgen: { mode: 'alternating', categories: ['push', 'pullVertical'] },
      middag: { mode: 'single', categories: ['legsHinge'] },
      aften: { mode: 'single', categories: ['coreSkillB'] }
    }
  },
  {
    dayOfWeek: 5,
    isLightDay: false,
    sessions: {
      morgen: { mode: 'single', categories: ['handstand'] },
      middag: { mode: 'alternating', categories: ['dips', 'pullRow'], finisher: 'conditioning' },
      aften: { mode: 'single', categories: ['legsHinge'] }
    }
  },
  {
    dayOfWeek: 6,
    isLightDay: false,
    sessions: {
      morgen: { mode: 'single', categories: ['legsQuad'] },
      middag: { mode: 'single', categories: ['coreSkillA'] },
      aften: { mode: 'single', categories: ['conditioning'] }
    }
  },
  {
    dayOfWeek: 7,
    isLightDay: true,
    sessions: {
      morgen: {
        mode: 'lightDay',
        durationNote: '10-15 min',
        items: [
          { name: 'Bånd pull-aparts', sets: 2, reps: 15 },
          { name: 'Håndledsmobilitet' },
          { name: 'Thorakal rotation' },
          { name: 'Let væg-håndstand', sets: 3, holdSeconds: 15 }
        ]
      },
      middag: {
        mode: 'lightDay',
        note: 'teknik, ikke belastning',
        items: [
          { name: 'L-sit vedligehold', sets: 3, holdSeconds: 10 },
          { name: 'Hollow body', sets: 2, holdSeconds: 20 }
        ]
      },
      aften: {
        mode: 'lightDay',
        durationNote: '20-30 min',
        note: 'ingen strukturerede sæt',
        items: [
          { name: 'Let gåtur eller udstrækning' }
        ]
      }
    }
  }
];
